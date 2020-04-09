/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import LrSession from '../lr/LrSession'
import HorizontalAssetView from './HorizontalAssetView'

async function _getAlbumAssetsP(album) {
	let lr = await LrSession.currentContextP()
	return lr.getAlbumAssetsP(album.id)
}

function _getCachedAlbumAssetsP(album) {
	if (!album._assetsPromise) {
		album._assetsPromise = _getAlbumAssetsP(album)
	}
	return album._assetsPromise
}

class HorizontalAlbumAssetView {
	constructor(album, onClick) {
		let assetView = HorizontalAssetView(null, onClick)
		this.element = assetView.element
		_getCachedAlbumAssetsP(album).then((albumAssets) => {
			let assets = albumAssets.map((albumAsset) => albumAsset.asset)
			assetView.assets = assets
		})
	}
}

export default (album, onClick) => new HorizontalAlbumAssetView(album, onClick)
