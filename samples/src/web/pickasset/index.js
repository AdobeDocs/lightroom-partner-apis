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
import InfoView from '../../common/components/InfoView'
import LrSession from '../../common/lr/LrSession'
import PickAsset from './PickAsset'

async function mainP() {
	let infoView = InfoView()
	document.body.appendChild(infoView.element)

	try {
		let lr = await LrSession.currentContextP()
		let status = lr.account.entitlement.status
		infoView.log(lr.account.full_name)
		infoView.log(lr.account.email)
		infoView.log(status)
		infoView.log('catalog found')
		document.body.appendChild(PickAsset(lr).element)
	} catch (err) {
		infoView.warning(err.message)
	}
}

mainP()
