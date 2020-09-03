const request = require('request-promise')
const crypto = require('crypto')
const adobeApiKey = require('../public/config').adobeApiKey
const _lrEndpoint = 'https://lr.adobe.io'

let Lr = {
	util: {
		// utility to check the health of the Lightroom services
		getHealthP: function() {
			let options = {
				uri: `${_lrEndpoint}/v2/health`,
				headers: {
					'X-API-Key': adobeApiKey,
					method: 'GET'
				}
			}
			return request(options)
				.then((result) => {
					return 'Lightroom Services are up'
				})
				.catch((error) => {
					return Promise.reject('Lightroom Services are down')
				})
		},

		// utility to get the user account
		getAccountP: function(token) {
			if (!token) {
				return Promise.reject('get account failed: no user token')
			}
			return Lr.getJSONP(token, '/v2/account')
				.then((account) => {
					return account
				})
				.catch((error) => {
					return Promise.reject(`get account failed with error: ${error.statusCode}`)
				})
		},

		// utility to get the user catalog
		getCatalogP: function(token) {
			if (!token) {
				return Promise.reject('get catalog failed: no user token')
			}
			return Lr.getJSONP(token, '/v2/catalog')
				.then((catalog) => {
					return catalog
				})
				.catch((error) => {
					return Promise.reject(`get catalog failed with error: ${error.statusCode}`)
				})
		},

		// utility function to create a new asset revision and upload the original file
		uploadImageP: async function(token, importedBy, catalog_id, fileName, data) {
			function _createUuid() {
				// helper function for generating a Lightroom unique identifier
				let bytes = crypto.randomBytes(16)
				bytes[6] = bytes[6] & 0x0f | 0x40
				bytes[8] = bytes[8] & 0x3f | 0x80
				return bytes.toString('hex')
			}

			// new revision url
			let asset_id = _createUuid()
			let revision_id = _createUuid()
			let revisionUrl = `/v2/catalogs/${catalog_id}/assets/${asset_id}/revisions/${revision_id}`

			function _createRevisionP() {
				// create a new asset revision by populating the required JSON data.
				let importTimestamp = (new Date()).toISOString()
				let content = {
					subtype: 'image',
					payload: {
						captureDate: '0000-00-00T00:00:00',
						userCreated: importTimestamp,
						userUpdated: importTimestamp,
						importSource: {
							fileName: fileName,
							importTimestamp: importTimestamp,
							importedBy: importedBy,
							importedOnDevice: adobeApiKey
						}
					}
				}
				let sha256 = crypto.createHash('sha256').update(data).digest('hex')
				return Lr.putJSONP(token, revisionUrl, content, sha256)
					.catch((error) => {
						if (error.statusCode == 412) {
							return Promise.reject('create revision failed: duplicate found')
						}
						return Promise.reject(`create revision failed: error status ${error.statusCode}`)
					})
			}

			function _putOriginalP() {
				let relativeUrl = `${revisionUrl}/master`
				let contentType = 'application/octet-stream'
				return Lr.putOriginalP(token, relativeUrl, contentType, data)
					.catch((error) => {
						return Promise.reject(`upload failed: put original error status ${error.statusCode}`)
					})
			}

			await _createRevisionP()
			return _putOriginalP().then(() => {
				return 'upload succeeded'
			})
		}
	},

	// function to fetch JSON from a Lightroom services endpoint. all JSON that is
	// returned is guarded with a while(1){} preface to thwart malicious activity.
	// need to strip the preface before converting the result to a JavaScript object.
	getJSONP: function(token, relativeUrl) {
		function _processJSONResponse(response) {
			let while1Regex = /^while\s*\(\s*1\s*\)\s*{\s*}\s*/
			return response ? JSON.parse(response.replace(while1Regex, '')) : null
		}
		let options = {
			uri: `${_lrEndpoint}${relativeUrl}`,
			headers: {
				'X-API-Key': adobeApiKey,
				Authorization: `Bearer ${token}`,
				method: 'GET'
			}
		}
		return request(options).then(_processJSONResponse)
	},

	// function to put JSON to a Lightroom services endpoint. this function is
	// used to create new asset revisions, so it takes an optional SHA-256
	// value to populate the "If-None-Match" header, if it is present.
	putJSONP: function(token, relativeUrl, content, sha256) {
		let options = {
			uri: `${_lrEndpoint}${relativeUrl}`,
			headers: {
				'X-API-Key': adobeApiKey,
				Authorization: `Bearer ${token}`,
				method: 'PUT',
				'Content-Type': 'application/json'
			},
			body: content,
			json: true
		}
		if (sha256) {
			options.headers['If-None-Match'] = sha256
		}
		return request.put(options)
	},

	// function to upload a buffer containing image or video data. assumes the data
	// can be accommodated in a single call. otherwise, it is necessary to chunk
	// the data. that is outside the scope of this example.
	putOriginalP: function(token, relativeUrl, contentType, data) {
		let options = {
			uri: `${_lrEndpoint}${relativeUrl}`,
			headers: {
				'X-API-Key': adobeApiKey,
				Authorization: `Bearer ${token}`,
				method: 'PUT',
				'Content-Type': contentType
			},
			body: data
		}
		return request.put(options)
	}

}

module.exports = Lr
