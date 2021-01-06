/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
class PickAsset {
	constructor(root, onClick) {
		this.element = document.createElement('div')

		let picker = document.createElement('lr-samples-albumgrid')
		picker.className = 'well'
		picker.addEventListener('selected-changed', (event) => {
			let asset = event.detail && event.detail.selected && event.detail.selected[0] // first asset
			if (!asset || !onClick) return
			onClick(asset)
		})

		let albumPicker = document.createElement('lr-samples-foldergrid')
		albumPicker.className = 'lhp'
		albumPicker.addEventListener('selected-changed', (event) => {
			let album = event.detail.selected[0]
			let context = JSON.stringify({
				preselected: [],
				source: album // show first album
			})
			picker.setAttribute('context', context)
		})

		this.element.appendChild(albumPicker)
		this.element.appendChild(picker)

		albumPicker.active = root
	}
}

export default (root, onClick) => new PickAsset(root, onClick)
