/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
const LrSession = require('../../common/lr/LrSession')
const LrUtils = require('../../common/lr/LrUtils')

async function mainP() {
	let lr = await LrSession.currentContextP()
	let root = await LrUtils.getRootProjectSetP(lr)
	await LrUtils.logAlbumP(lr, root)
}

mainP().then(() => console.log('done')).catch(e => console.error('error:', e))
