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
import AssetThumbView from './AssetThumbView'

class HorizontalAssetView {
	constructor(assets, onClick) {
		this._onClick = onClick
		this.element = document.createElement('div')
		this.element.className = 'horizontal'
		assets = assets || []
		assets.forEach((asset) => this.element.appendChild(AssetThumbView(asset, this._onClick).element))
	}
	set assets(assets) {
		while (this.element.firstChild) {
			container.removeChild(this.element.firstChild)
		}
		assets.forEach((asset) => this.element.appendChild(AssetThumbView(asset, this._onClick).element))
	}
}

export default (assets, onClick) => new HorizontalAssetView(assets, onClick)
