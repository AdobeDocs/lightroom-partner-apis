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
const File = require('../../common/file/File')
const FileUtils = require('../../common/file/FileUtils')

async function mainP(filePath) {
	let lr = await LrSession.currentContextP()
	let file = await File.fileP(filePath)
	let assetId = await FileUtils.uploadFileP(lr, file)
	console.log(`asset id: ${assetId}`)
}

let filePath = process.argv[2]
mainP(filePath).then(() => console.log('done')).catch(e => console.error(e))
