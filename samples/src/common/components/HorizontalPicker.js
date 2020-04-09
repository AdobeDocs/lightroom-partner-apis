/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import './HorizontalPicker.css'
import AlbumBreadcrumb from './AlbumBreadcrumb'
import HorizontalAlbumView from './HorizontalAlbumView'
import LrUtils from '../lr/LrUtils'

let _getAlbumHierarchyP = async (lr) => {
	let rootCollection = await LrUtils.getRootCollectionSetP(lr)
	let rootProject = await LrUtils.getRootProjectSetP(lr)
	let root = {
		subtype: 'collection_set',
		payload: { name: 'Collections and Projects' },
		_childAlbums: [ rootCollection, rootProject ]
	}
	rootCollection._parent = root
	rootProject._parent = root
	return root
}

class HorizontalPicker {
	constructor(lr, onAssetClick) {
		this._onAssetClick = onAssetClick

		this.element = document.createElement('div')
		this.element.className = 'picker'
		_getAlbumHierarchyP(lr).then((root) => {
			this._breadcrumb = AlbumBreadcrumb(root, (album) => this._breadcrumbAlbumChanged(album))
			this.element.appendChild(this._breadcrumb.element)
			this._albumView = HorizontalAlbumView(root, (album) => this._albumViewAlbumChanged(album), this._onAssetClick)
			this.element.appendChild(this._albumView.element)
		})
	}
	_breadcrumbAlbumChanged(album) {
		console.log('displaying album:', album)
		this._albumView.element.remove()
		this._albumView = HorizontalAlbumView(album, (album) => this._albumViewAlbumChanged(album), this._onAssetClick)
		this.element.appendChild(this._albumView.element)
	}
	_albumViewAlbumChanged(album) {
		console.log('displaying album:', album)
		this._breadcrumb.album = album
	}
}

export default (lr, onAssetClick) => new HorizontalPicker(lr, onAssetClick)
