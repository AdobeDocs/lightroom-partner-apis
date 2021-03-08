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

class LrRenditionManager {
	constructor(session, account, catalog) {
		this._lr = new LrContext(session, account, catalog)
		this._objectURLHash = {}
	}

	_create(id, buffer) {
		let blob = buffer ? new Blob([ new Uint8Array(buffer) ], { type: 'image/jpeg' }) : null
		this._objectURLHash[id] = blob ? URL.createObjectURL(blob) : ''
		return this._objectURLHash[id]
	}

	clear() {
		Object.values(this._objectURLHash).forEach(value => URL.revokeObjectURL(value))
	}

	getDeferredAlbumCoverThumbnailObjectURL(album) {
		let deferred = new Deferred()

		this._lr.getAlbumCoverThumbnailRenditionOrFallbackP(album).then((buffer) => {
			deferred.resolve(this._create(album.id, buffer))
		}).catch(error => deferred.reject(error))

		return deferred
	}

	getDeferredAssetThumbnailObjectURL(asset) {
		let deferred = new Deferred()

		this._lr.getAssetRenditionP(asset.id, 'thumbnail2x').then((buffer) => {
			deferred.resolve(this._create(asset.id, buffer))
		})

		return deferred
	}
}

export default LrRenditionManager
