/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import './AlbumBreadcrumb.css'

class Breadcrumb {
	constructor(album, onAlbumChanged) {
		this._album = album
		this._onAlbumChanged = onAlbumChanged

		let text = (album._parent ? '\u25C3 ' : '') + album.payload.name
		this._textNode = document.createTextNode(text)
		this.element = document.createElement('div')
		this.element.className = 'breadcrumb'
		this.element.appendChild(this._textNode)
		this.element.addEventListener('click', () => this.album = this._album._parent)
	}

	set album(album) {
		if (album && this._album != album) {
			this._album = album
			this._textNode.nodeValue = (album._parent ? '\u25C3 ' : '') + album.payload.name
			this._onAlbumChanged(this._album)	
		}
	}
}

export default (album, onAlbumChanged) => new Breadcrumb(album, onAlbumChanged)
