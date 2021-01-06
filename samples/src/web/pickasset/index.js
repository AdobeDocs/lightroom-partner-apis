/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import './styles.css'
import InfoView from '../components/InfoView'
import LrSession from '../../common/lr/LrSession'
import LrUtils from '../../common/lr/LrUtils'
import LrImageManager from '../../common/lr/LrImageManager'
import '../components/FolderGridView'
import '../components/AlbumGridView'
import PickAsset from './PickAsset'

let _getAlbumHierarchyP = async (lr) => {
	let collectionHierarchy = await LrUtils.getRootCollectionSetP(lr)
	// let projectHierarchy = await LrUtils.getRootProjectSetP(lr)
	return collectionHierarchy
}

async function _getAsset2048RenditionObjectURLP(lr, asset) {
	let buffer = await lr.getAsset2048RenditionP(asset.id)
	let blob = new Blob([ new Uint8Array(buffer) ], { type: 'image/jpeg' })
	return URL.createObjectURL(blob)
}

async function mainP() {
	let infoView = InfoView()

	let header = document.createElement('div')
	header.className = 'header'
	document.body.appendChild(header)
	header.appendChild(infoView.element)

	let canvas = document.createElement('div')
	canvas.className = 'canvas'
	document.body.appendChild(canvas)

	try {
		let lr = await LrSession.currentContextP()
		infoView.name = lr.account.full_name
		infoView.email = lr.account.email
		infoView.entitlement = lr.account.entitlement.status
		infoView.status = 'catalog found'

		let root = await _getAlbumHierarchyP(lr)
		infoView.status = 'album hierarchy loaded'

		let imageManager = new LrImageManager(lr._session, lr.account, lr.catalog)

		let albumGridComponentConstructor = window.customElements.get('lr-samples-albumgrid')
		albumGridComponentConstructor.setGlobals(lr._session, lr.account, lr.catalog)
		albumGridComponentConstructor.setImageManager(imageManager)

		let folderGridComponentConstructor = window.customElements.get('lr-samples-foldergrid')
		folderGridComponentConstructor.setImageManager(imageManager)

		let picker = PickAsset(root, (asset) => {
			let img = document.createElement('img')
			let rendition = document.createElement('div')
			rendition.className = 'popover'
			rendition.appendChild(img)
			rendition.onclick = () => {
				if (img.src) {
					URL.revokeObjectURL(img.src)
				}
				rendition.remove()
			}
			document.body.appendChild(rendition)
			_getAsset2048RenditionObjectURLP(lr, asset).then((objectURL) => img.src = objectURL)
		})
		canvas.appendChild(picker.element)
	} catch (err) {
		infoView.status = err.message
	}
}

mainP()
