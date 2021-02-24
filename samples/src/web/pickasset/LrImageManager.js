/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
class LrImageManager {
	constructor(renditionManager) {
		this._deferredHash = {}
		this._renditionManager = renditionManager
	}

	getAlbumCoverThumbnailObjectURLP(album) {
		if (!this._deferredHash[album.id]) {
			this._deferredHash[album.id] = this._renditionManager.getDeferredAlbumCoverThumbnailObjectURL(album)
		}
		return this._deferredHash[album.id].promise
	}

	getAssetThumbnailObjectURLP(asset) {
		if (!this._deferredHash[asset.id]) {
			this._deferredHash[asset.id] = this._renditionManager.getDeferredAssetThumbnailObjectURL(asset)
		}
		return this._deferredHash[asset.id].promise
	}
}

export default LrImageManager
