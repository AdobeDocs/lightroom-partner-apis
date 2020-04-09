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
import './AssetRendition.css'

async function _getAsset2048RenditionObjectURLP(asset) {
	let lr = await LrSession.currentContextP()
	let buffer = await lr.getAsset2048RenditionP(asset.id)
	let blob = new Blob( [ new Uint8Array( buffer ) ], { type: 'image/jpeg' } )
	return URL.createObjectURL(blob)
}

class AssetRendition {
	constructor(asset) {
		let img = document.createElement('img')
		let rendition = document.createElement('div')
		rendition.className = 'rendition'
		rendition.appendChild(img)
		if (asset) {
			_getAsset2048RenditionObjectURLP(asset).then((objectURL) => img.src = objectURL)
		}
		this.element = document.createElement('div')
		this.element.appendChild(rendition)
	}
}

export default (asset) => new AssetRendition(asset)
