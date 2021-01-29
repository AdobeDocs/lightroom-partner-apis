/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import LrContext from '../../common/lr/LrContext'

class Deferred {
	constructor() {
		this.promise = new Promise((resolve, reject) => this._deferredApi = { resolve, reject })
		this.state = 'pending'
	}

	resolve(value) {
		this._deferredApi.resolve(value)
		this.state = 'fulfilled'
	}

	reject(value) {
		this._deferredApi.reject(value)
		this.state = 'rejected'
	}
}

class ObjectURLManager {
	constructor() {
		this._objectURLHash = {}
		this._deferredHash = {}
		this._destructed = false
	}

	destruct() {
		if (this._destructed) {
			throw new Error('ObjectURLManager destructed')
		}

		// reject the pending deferreds
		Object.values(this._deferredHash).forEach(deferred => {
			if (deferred.state === 'pending') {
				deferred.reject('ObjectURLManager destructed')
			}
		})
		this._deferredHash = {}

		// revoke the created object URLs
		Object.values(this._objectURLHash).forEach(objectURL => URL.revokeObjectURL(objectURL))
		this._objectURLHash = {}

		this._destructed = true // only let this happen once
	}

	getP(id) {
		if (this._destructed) {
			throw new Error('ObjectURLManager destructed')
		}
		if (!this._deferredHash[id]) {
			this._deferredHash[id] = new Deferred()
		}
		return this._deferredHash[id].promise
	}

	create(id, blob) {
		if (this._destructed) {
			throw new Error('ObjectURLManager destructed')
		}
		this._objectURLHash[id] = blob ? URL.createObjectURL(blob) : ''
		if (!this._deferredHash[id]) {
			this._deferredHash[id] = new Deferred()
		}
		this._deferredHash[id].resolve(this._objectURLHash[id])
	}
}

class LrImageManager {
	constructor(session, account, catalog) {
		this._lr = new LrContext(session, account, catalog)
		this._blobPromiseHash = {}
		this._objectURLManager = new ObjectURLManager()
	}

	getAlbumCoverObjectURLP(album) {
		if (!this._blobPromiseHash[album.id]) {
			this._blobPromiseHash[album.id] = this._lr.getAlbumCoverOrFallbackBlobP(album).then((blob) => {
				this._objectURLManager.create(album.id, blob)
			})
		}
		return this._objectURLManager.getP(album.id)
	}

	getAssetThumbnailObjectURLP(asset) {
		if (!this._blobPromiseHash[asset.id]) {
			this._blobPromiseHash[asset.id] = this._lr.getAssetThumbnailRenditionP(asset.id).then((buffer) => {
				let blob = new Blob([ new Uint8Array(buffer) ], { type: 'image/jpeg' })
				this._objectURLManager.create(asset.id, blob)
			})
		}
		return this._objectURLManager.getP(asset.id)
	}
	
}

export default LrImageManager
