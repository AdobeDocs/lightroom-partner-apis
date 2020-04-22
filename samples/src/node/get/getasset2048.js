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
const FileUtils = require('../../common/file/FileUtils')

async function mainP(assetId) {
	let lr = await LrSession.currentContextP()
	let buffer = await lr.getAsset2048RenditionP(assetId)
	let name = `${assetId}.2048.jpg`
	await FileUtils.writeBufferToFileP(buffer, name)
	console.log('success: ', name)
}

mainP(process.argv[2]).then(() => console.log('done')).catch(e => console.error('error:', e))
