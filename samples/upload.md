## Upload Image Example

This tutorial steps through uploading a single image to an authenticated customer. It is based on the [OAuth 2.0 Example: Node.js](https://github.com/AdobeDocs/adobeio-auth/tree/stage/OAuth/samples/adobe-auth-node) that can be found on GitHub.

To run this sample locally, clone that repository and replace the `creative_sdk` scope in _server/index.js_ with `lr_partner_apis`. Then follow the instructions in the ReadMe to run the application. Authorization through the Adobe Identify Management System is working as expected if a user is able to successfully log in and view their profile information.

### Replace the Client View

Replace _views/index.jade_ with:

```doctype
html
  head
    title Lightroom REST API Example
    script.
      function putBlobContentP(url, blob) {
        return new Promise(function(resolve, reject) {
          let xhr = new XMLHttpRequest()
          xhr.open('PUT', url)
          xhr.setRequestHeader('Content-Type', 'application/octet-stream')
          xhr.setRequestHeader('Content-Range', `bytes 0-${blob.size - 1}/${blob.size}`)
          xhr.onload = function() {
            if (200 <= xhr.status && xhr.status < 300) {
              resolve(xhr.response)
            }
            else {
              let msg = `XHR load failed with status ${xhr.status}`
              reject(msg)
            }
          }
          xhr.onerror = ()=> {
            let msg = `XHR call failed with status ${xhr.status}`
            reject(msg)
          }
          xhr.send(blob)
        })
      }

      // handle the input file dialog on-click
      async function importFile(file) {
        let result = document.getElementById('result')
        result.innerHTML = 'uploading...'

        let subtype = 'image' // need to generalize to video
        let importTimestamp = (new Date()).toISOString()
        let fileName = encodeURIComponent(file.name)
        let url = `https://localhost:8000/upload?subtype=${subtype}&timestamp=${importTimestamp}&file_name=${fileName}`
        putBlobContentP(url, file).then(() => {
          result.innerHTML = "upload succeeded"
        }).catch((err) => {
          result.innerHTML = "upload failed:" + err
        })
      }
  body
    button(id='button' onclick="location.href='/login'") Log In with Adobe
    p info: #{info}
    p name: #{full_name}
    p email: #{email}
    p status: #{status}
    input(id='input', type='file', style='display:none', onchange='importFile(input.files[0])')
    p(id='result')

    script.
      window.onload = function () {
          let status = '#{status}'
          if (status == 'trial' || status == 'subscriber') {
            let button = document.getElementById('button')
            button.style.visibility = 'hidden'
            let input = document.getElementById('input')
            input.style.display = 'inline'
          }
      }
```

### Replace the Server

Replace _server/index.js_ with:

```
const express = require('express')
const app = express()
const session = require('express-session')
const request = require('request-promise')
const https = require('https')
const bodyParser = require('body-parser')
const adobeApiKey = require('../public/config.js').adobeApiKey
const adobeApiSecret = require('../public/config.js').adobeApiSecret
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// host name and port behind which the express application will run. needs to be
// included in the redirect URIs for the Adobe integration for login to succeed.
const hostname = 'localhost'
const port = 8000

// endpoints for the Adobe Identity Management System (IMS) and Lightroom Services
const imsEndpoint = 'https://ims-na1-stg1.adobelogin.com'
const lrEndpoint = 'https://lr-stage.adobe.io'

// middlewares
app.use(bodyParser.json())
app.use(bodyParser.raw({limit: '200mb'}))
app.use(express.static(path.join(__dirname, '../public')))
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'jade')
app.use(session({
	secret: 'this-is-secret', // change this to your own secret value
	resave: true,
	saveUninitialized: true,
	cookie: { 
		secure: false,
		maxAge: 6000000
	}
}))

// function to fetch JSON from a Lightroom services endpoint. all JSON that
// is returned is guarded with a while(1){} preface to thwart malicious
// activity. need to strip the preface before converting the result to JSON
let _getJSONP = function(apiKey, token, uri) {
	function _processJSONResponse(response) {
		let while1Regex = /^while\s*\(\s*1\s*\)\s*{\s*}\s*/
		return response ? JSON.parse(response.replace(while1Regex, '')) : null
	}
	let options = {
		uri: uri,
		headers: {
			'X-API-Key': apiKey,
			Authorization: `Bearer ${token}`,
			method: 'GET'
		}
	}
	return request(options).then(_processJSONResponse)
}

// function to put JSON to a Lightroom services endpoint. this function is
// used to create new asset revisions, so it takes an optional SHA-256
// value to populate the "If-None-Match" header, if it is present.
let _putJSONP = function(apiKey, token, uri, content, sha256) {
	let options = {
		uri: uri,
		headers: {
			'X-API-Key': apiKey,
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
}

// function to upload a buffer containing image or video data. may be called
// multiple times if the object is broken into chunks, so it takes in the
// Content-Range value. always makes a reuqest for Lightroom to generate all
// of the renditions associated with the asset, when the upload is complete.
let _putMasterP = function(apiKey, token, uri, contentType, contentRange, data) {
	let options = {
		uri: uri,
		headers: {
			'X-API-Key': apiKey,
			Authorization: `Bearer ${token}`,
			method: 'PUT',
			'Content-Type': contentType,
			'Content-Range': contentRange,
			'X-Generate-Renditions': 'all'
		},
		body: data
	}
	return request.put(options)
}

// top-level route of the service. just render the client view with unknown
// information. the client will then decide to present a login button.
app.get('/', function (req, res) {
	res.render('index', {
		info: 'waiting for a user...',
		full_name: 'unknown',
		email: 'unknown',
		status: 'unknown'
	})
})

// retrieve an authorization code for the API key. this call will display
// the Adobe login screen if necessary to authenticate the user, followed
// by the consent screen if the user has not already given consent. and
// upon completion, it will redirect back here to the /callback endpoint
app.get('/login', function(req, res){
	let redirect_uri = `https://${hostname}:${port}/callback`
	res.redirect(`${imsEndpoint}/ims/authorize?client_id=${adobeApiKey}&scope=openid,creative_sdk&response_type=code&redirect_uri=${redirect_uri}`)
})

// callback at the end of the Adobe login process started above at /login.
// responsible for fetching the Lightroom user account and catalog and
// rendering some pertinent information in the client view.
app.get('/callback', function(req, res){
	// call the Adobe Identity Management System (IMS) to fetch an access
	// token from the authorization code. requires client id and secret.
	let code = req.query.code // authorization code
	let options = {
		uri: `${imsEndpoint}/ims/token?grant_type=authorization_code&client_id=${adobeApiKey}&client_secret=${adobeApiSecret}&code=${code}`,
		method: 'POST',
		json: true
	}
	request(options)
		.then(function (response) {
			// the call to authenticate the user and acquire an access
			// token is successful. store the token in the session.
			req.session.token = response.access_token
		})
		.then(function () {
			// fetch the account of the authenticated Lightroom customer
			return _getJSONP(adobeApiKey, req.session.token, `${lrEndpoint}/v2/accounts/00000000000000000000000000000000`)
		})
		.then(function (account) {
			// the account request was successful. store relevant account
			// information in the session. in particular, we will need the
			// account identifier to set the 'importedBy' field on upload.
			// the other fields will be sent back to the client application.
			req.session.account_id = account.id
			req.session.full_name = account.full_name
			req.session.email = account.email
			req.session.status = account.entitlement.status

			// fetch the catalog of entitled users. if the customer does not
			// have a trial or a subscription, we will return nothing for
			// the catalog when this promise is resolved.
			if (account.entitlement.status == 'trial' || account.entitlement.status == 'subscriber') {
				return _getJSONP(adobeApiKey, req.session.token, `${lrEndpoint}/v2/catalogs/00000000000000000000000000000000`)
			}
		})
		.then(function (catalog) {
			// store the catalog information in the session. it is required
			// to make the create revision and upload master calls to the
			// Lightroom services. it is possible that the catalog does not
			// exist; gracefully handle that case instead of throwing an error.
			req.session.catalog_id = catalog ? catalog.id : null
		})
		.then(function () {
			// we have fetched the account and catalog (if it exists). now
			// return to the client application with the given information.
			res.render('index', {
				info: req.session.catalog_id ? 'catalog found' : 'no entitled catalog found',
				full_name: req.session.full_name,
				email: req.session.email,
				status: req.session.status
			})
		})
		.catch(function (error) {
			// there was an error in one of the three prevous promises in the
			// chain: fetching an access token, the account, or the catalog.
			// create an info string that captures where the failure occured.
			let info = req.session.token ? (req.session.account_id ? 'error fetching catalog' : 'error fetching account') : 'error logging in'
			res.render('index', {
				info: info,
				full_name: 'unknown',
				email: 'unknown',
				status: 'unknown'
			})
		})
})

// server endpoint to upload an image to the catalog of the authenticated
// Lightroom customer. takes in query parameters: asset subtype ('image'
// or 'video'), timestamp (ISO-8601, input if multiple assets are
// uploaded at the same time, ensuring they all share the same timestamp),
// and file name. the binary data needs to be in the body of the request.
app.put('/upload', function(req, res, next) {
	function _createUuid() {
		// helper function for generating a Lightroom unique identifier
		let bytes = crypto.randomBytes(16)
		bytes[6] = bytes[6] & 0x0f | 0x40
		bytes[8] = bytes[8] & 0x3f | 0x80
		return bytes.toString('hex')
	}

	function _sha256(buf) {
		// helper function to compute the SHA-256 to check for duplicates
		return crypto.createHash('sha256').update(buf).digest('hex')
	}

	// create a new asset revision by populating the required JSON data.
	let catalog_id = req.session.catalog_id
	let asset_id = _createUuid()
	let revision_id = _createUuid()
	let subtype = req.query.subtype
	let importTimestamp = req.query.timestamp
	let fileName = decodeURIComponent(req.query.file_name)
	let importedBy = req.session.account_id
	let importedOnDevice = adobeApiKey
	let sha256 = _sha256(req.body)

	let content = {
		subtype: subtype,
		payload: {
			captureDate: '0000-00-00T00:00:00',
			userCreated: importTimestamp,
			userUpdated: importTimestamp,
			importSource: {
				fileName: fileName,
				importTimestamp: importTimestamp,
				importedBy: importedBy,
				importedOnDevice: importedOnDevice
			}
		}
	}

	// put the asset revision JSON to the appropriate Lightroom endpoint
	let uri = `${lrEndpoint}/v2/catalogs/${catalog_id}/assets/${asset_id}/revisions/${revision_id}`
	_putJSONP(adobeApiKey, req.session.token, uri, content, sha256)
		.then(function() {
			// the create revision call was successful. now upload the
			// binary data to the appropriate Lightroom endpoint.
			let uri = `${lrEndpoint}/v2/catalogs/${catalog_id}/assets/${asset_id}/revisions/${revision_id}/master`
			let contentType = req.header('Content-Type')
			let contentRange = req.header('Content-Range')
			return _putMasterP(adobeApiKey, req.session.token, uri, contentType, contentRange, req.body)
				.then(function() {
					// the upload was successful. return to the client.
					res.send()
				})
		})
		.catch(next) // there was an error creating the revision or the master.
})

// set up an https server with the signed certification as per the readme
var httpsServer = https.createServer({
	key: fs.readFileSync(path.join(__dirname, 'key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
}, app).listen(port, hostname, (err) => {
	if (err) console.log(`Error: ${err}`)
	console.log(`listening on port ${port}!`)
})
```
