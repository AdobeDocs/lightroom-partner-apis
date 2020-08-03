/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
const LrRequestor = require('../../common/lr/LrRequestor')
const LrSession = require('../../common/lr/LrSession')

class LrContextPriv {
	constructor(session, account, catalog) {
		this.account = account
		this.catalog = catalog

		this._session = session
		this._accountId = account.id
		this._catalogId = catalog.id
	}

	getAssetPrivP(assetId) {
		let path = `/v2/catalogs/${this._catalogId}/assets/${assetId}`
		return LrRequestor.getP(this._session, path)
	}

	existsP = async function(path) {
		try {
			await LrRequestor.headP(this._session, path)
			return true
		} catch (err) {
			if (err.statusCode != 400) {
				throw err
			}
			return false
		}
	}

	waitForP = async (path) => {
		let sleep = () => new Promise(resolve => setTimeout(resolve, 3000)) // 3 sec
		let retries = 10
		for (let i = 0; i < retries; i++) {
			console.log(`try ${i}: sleeping...`)
			await sleep()
			console.log(`try ${i}: checking`)
			if (await this.existsP(path)) {
				console.log(`try ${i}: exists`)
				return path
			}
		}
		throw new Error(`timed out on: ${path}`)
	}

	waitForRendtionP = async (assetId, renditionType) => {
		let asset = await this.getAssetPrivP(assetId) // need to get links
		var link = asset.links[renditionType]
		if (!link || link.invalid) {
			throw new Error(`no ${renditionType} link for ${assetId}`)
		}
		let uri = `${asset.base}${link.href}`
		let url = new URL(uri) // peel off the path of the fully formed uri
		return this.waitForP(url.pathname + url.search)
	}

	waitFor2560RendtionP = function(assetId) {
		return this.waitForRendtionP(assetId, '/rels/rendition_type/2560')
	}

	waitForFullsizeRendtionP = function(assetId) {
		return this.waitForRendtionP(assetId, '/rels/rendition_type/fullsize')
	}

	getLatestRevisionIdP = async function(assetId) {
		let asset = await this.getAssetPrivP(assetId)
		if (!asset.revision_ids || asset.revision_ids.length < 1) {
			throw new Error('no revisions')
		}
		return asset.revision_ids[asset.revision_ids.length - 1]
	}

	generateRenditionP = async function(assetId, type) {
		let revisionId = await this.getLatestRevisionIdP(assetId)
		let path = `/v2/catalogs/${this._catalogId}/assets/${assetId}/revisions/${revisionId}/renditions/`
		let response = await LrRequestor.genP(this._session, path, type)

		let link = response.links[`/rels/rendition_type/${type}`]
		return `/v2/catalogs/${this._catalogId}/${link.href}` // return the path
	}

	generate2560RenditionP = async function(assetId) {
		let path = await this.generateRenditionP(assetId, '2560')
		return this.waitForP(path)
	}

	generateFullsizeRenditionP = async function(assetId) {
		let path = await this.generateRenditionP(assetId, 'fullsize')
		return this.waitForP(path)
	}

	async renditionExistsP(assetId, type) {
		let asset = await this.getAssetPrivP(assetId) // get full asset for links
		var link = asset.links[type]
		if (!link || link.invalid) {
			return false
		}
		let url = new URL(asset.base + link.href) // peel off the path of the fully formed uri
		return this.existsP(url.pathname + url.search)
	}

	asset2560RenditionExistsP(assetId) {
		return this.renditionExistsP(assetId, '/rels/rendition_type/2560')
	}

	assetFullsizeRenditionExistsP(assetId) {
		return this.renditionExistsP(assetId, '/rels/rendition_type/fullsize')
	}

	async getRenditionPrivP(assetId, type) {
		let asset = await this.getAssetPrivP(assetId) // get full asset for links
		var link = asset.links[type]
		if (!link || link.invalid) {
			throw new Error('missing or invalid rendition link')
		}
		let url = new URL(asset.base + link.href) // peel off the path of the fully formed uri
		return LrRequestor.getP(this._session, url.pathname + url.search)
	}

	getAsset2560RenditionP(assetId) {
		return this.getRenditionPrivP(assetId, '/rels/rendition_type/2560')
	}

	getAssetFullsizeRenditionP(assetId) {
		return this.getRenditionPrivP(assetId, '/rels/rendition_type/fullsize')
	}

}

let privHost = 'photos.adobe.io'
let privApiKey

if (process && process.env) {
	privHost = process.env.PRIVHOST || privHost
	privApiKey = process.env.PRIVKEY || privApiKey
}

let _lr

let LrSessionPriv = {
	currentContextP: async () => {
		if (_lr) {
			return _lr
		}
		let lr = await LrSession.currentContextP()
		let session = {
			host: privHost,
			accessToken: lr._session.accessToken,
			apiKey: privApiKey || lr._session.apiKey
		}
		_lr = new LrContextPriv(session, lr.account, lr.catalog)
		return _lr
	}
}

module.exports = LrSessionPriv
