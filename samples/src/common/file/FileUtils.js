/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
const File = require('./File')
const LrUtils = require('../lr/LrUtils')

function _uploadMasterP(lr, filePath, size, master_create, mime) {
	let chunkHandlerP = (data, offset) => lr.putMasterP(master_create, mime, offset, size, data)
	return File.streamP(filePath, lr.chunkSize, chunkHandlerP)
}

async function _uploadFileP(lr, file) {
	let revision = await lr.createRevisionP(file.subtype, file.name, file.size, file.sha256)
	try {
		await _uploadMasterP(lr, file.path, file.size, revision.master_create, file.mime)
	}
	catch (err) {
		console.log(`error on upload left an incomplete asset: ${revision.id}`) // should retry
		throw(err)
	}
	return revision.id
}

let FileUtils = {
	uploadFileP: async function(lr, file) {
		try {
			return await _uploadFileP(lr, file)
		} catch(err) {
			if (err.statusCode != 412) {
				throw err
			}
			console.log('skipped upload (returning duplicate)')
			return LrUtils.getAssetIdFromRevision(err.error.revisions[0])
		}
	},

	uploadFilesP: async function(lr, files) {
		let assets = []
		for (const file of files) {
			let assetId = await FileUtils.uploadFileP(lr, file) // could be parallel
			assets.push( { id: assetId, remoteId: file.path })
		}
		return assets
	}
}

module.exports = FileUtils
