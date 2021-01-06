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

async function mainP() {
	let infoView = InfoView()
	document.body.appendChild(infoView.element)
	try {
		let lr = await LrSession.currentContextP()
		infoView.name = lr.account.full_name
		infoView.email = lr.account.email
		infoView.entitlement = lr.account.entitlement.status
		infoView.status = 'catalog found'
	} catch (err) {
		infoView.warning(err.message) // throws error on validation
	}
}

mainP()
