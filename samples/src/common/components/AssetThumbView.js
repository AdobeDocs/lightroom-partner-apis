/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import './AssetThumbView.css'
import LrSession from '../lr/LrSession'
import LrUtils from '../lr/LrUtils'

async function _getAssetThumbnailObjectURLP(asset) {
	let lr = await LrSession.currentContextP()
	let buffer = await lr.getAssetThumbnailRenditionP(asset.id)
	let blob = new Blob( [ new Uint8Array( buffer ) ], { type: 'image/jpeg' } )
	return URL.createObjectURL(blob)
}

function _getCachedAssetThumbnailObjectURLP(asset) {
	if (!asset._thumbnailPromise) {
		asset._thumbnailPromise = _getAssetThumbnailObjectURLP(asset)
	}
	return asset._thumbnailPromise
}

function createAssetThumbElement(asset, onClick) {
	let img = document.createElement('img')
	img.addEventListener('click', () => onClick(asset))
	img.className = 'slot asset'
	img.style.width = LrUtils.getAssetAspectRatio(asset) * 150 + 'px'
	img.style.height = '150px'
	_getCachedAssetThumbnailObjectURLP(asset).then((objectURL) => {
		if (objectURL) img.src = objectURL
	})
	return img
}

class AssetThumbView {
	constructor(asset, onClick) {
		this.element = createAssetThumbElement(asset, onClick)
	}
}

export default (asset, onClick) => new AssetThumbView(asset, onClick)
