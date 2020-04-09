/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import './HorizontalView.css'
import AlbumThumbView from './AlbumThumbView'

class HorizontalFolderView {
	constructor(album, onClick) {
		this.element = document.createElement('div')
		this.element.className = 'horizontal'
		album._childAlbums.forEach((album) => this.element.appendChild(AlbumThumbView(album, onClick).element))
	}
}

export default (album, onClick) => new HorizontalFolderView(album, onClick)
