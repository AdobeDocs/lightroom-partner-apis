/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import HorizontalFolderView from './HorizontalFolderView'
import HorizontalAlbumAssetView from './HorizontalAlbumAssetView'

class HorizontalAlbumView {
	constructor(album, onAlbumClick, onAssetClick) {
		if (album.subtype == 'collection_set' || album.subtype == 'project_set') {
			this.element = HorizontalFolderView(album, onAlbumClick).element
		}
		else {
			this.element = HorizontalAlbumAssetView(album, onAssetClick).element
		}
	}
}

export default (album, onAlbumClick, onAssetClick) => new HorizontalAlbumView(album, onAlbumClick, onAssetClick)
