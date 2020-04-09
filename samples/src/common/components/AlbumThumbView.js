/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import './AlbumThumbView.css'
import LrSession from '../lr/LrSession'

let _folderIconObjectURL

function _getCachedFolderIconObjectURL() {
	if (_folderIconObjectURL) {
		return _folderIconObjectURL
	}
	let svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-224 -256 512 512"><g><path class="st1" d="M58,12H36.7c-0.3,0-0.5-0.1-0.7-0.3l-6.2-6.2c-1-1-2.2-1.5-3.5-1.5H6c-3.3,0-6,2.7-6,6v44c0,3.3,2.7,6,6,6h52 c3.3,0,6-2.7,6-6V18C64,14.7,61.3,12,58,12z M62,54c0,2.2-1.8,4-4,4H6c-2.2,0-4-1.8-4-4V14h56c2.2,0,4,1.8,4,4V54z"></path></g></svg>'
	let bytes = new Array(svg.length)
	for (let i = 0; i < svg.length; i++) {
		bytes[i] = svg.charCodeAt(i)
	}
	_folderIconObjectURL = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: 'image/svg+xml' }))
	return _folderIconObjectURL
}

async function _getAlbumCoverObjectURLP(album) {
	let lr = await LrSession.currentContextP()
	let buffer = await lr.getAlbumCoverP(album)
	if (buffer) {
		let blob = new Blob( [ new Uint8Array( buffer ) ], { type: 'image/jpeg' } )
		return URL.createObjectURL(blob)
	}
	// use the first asset in the album as the cover
	let albumAsset = await lr.getFirstAlbumAssetP(album.id)
	if (albumAsset) {
		let buffer = await lr.getAssetThumbnailRenditionP(albumAsset.asset.id)
		let blob = new Blob( [ new Uint8Array( buffer ) ], { type: 'image/jpeg' } )
		return URL.createObjectURL(blob)
	}
}

function _getCachedAlbumCoverObjectURLP(album) {
	if (!album._coverPromise) {
		if (album.subtype == 'collection_set' || album.subtype == 'project_set') {
			album._coverPromise = Promise.resolve(_getCachedFolderIconObjectURL())
		}
		else {
			album._coverPromise = _getAlbumCoverObjectURLP(album)
		}
	}
	return album._coverPromise
}

function createAlbumElement(album, onClick) {
	let slot = document.createElement('div')
	slot.className = 'slot album'
	slot.addEventListener('click', () => onClick(album))
	let text = document.createTextNode(album.payload.name)
	let title = document.createElement('p')
	title.appendChild(text)
	slot.appendChild(title)
	let img = document.createElement('img')
	slot.appendChild(img)
	_getCachedAlbumCoverObjectURLP(album).then((objectURL) => {
		if (objectURL) img.src = objectURL
	})
	return slot
}

class AlbumThumbView {
	constructor(album, onClick) {
		this.element = createAlbumElement(album, onClick)
	}
}

export default (album, onClick) => new AlbumThumbView(album, onClick)
