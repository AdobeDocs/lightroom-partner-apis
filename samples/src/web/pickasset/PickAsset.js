/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import AssetRendition from '../../common/components/AssetRendition'
import HorizontalPicker from '../../common/components/HorizontalPicker'

class PickAsset {
	constructor(lr) {
		this.element = document.createElement('div')
		let rendition = AssetRendition()
		let picker = HorizontalPicker(lr, (asset) => {
			if (rendition) {
				rendition.element.remove()
			}
			rendition = AssetRendition(asset)
			this.element.appendChild(rendition.element)
		})
		this.element.appendChild(picker.element)
		this.element.appendChild(document.createElement('hr'))
		this.element.appendChild(rendition.element)
	}
}

export default (lr) => new PickAsset(lr)
