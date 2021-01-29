/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import File from './File.mjs'
import LrUtils from '../lr/LrUtils.mjs'
import fs from 'fs'

function _uploadOriginalP(lr, filePath, size, path, mime) {
	let chunkHandlerP = (data, offset) => lr.putOriginalP(path, mime, offset, size, data)
	return File.streamP(filePath, lr.chunkSize, chunkHandlerP)
}

async function _uploadFileP(lr, file) {
	let revision = await lr.createRevisionP(file.subtype, file.name, file.size, file.sha256)
	try {
		await _uploadOriginalP(lr, file.path, file.size, revision.path, file.mime)
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
	},

	readStringFromFileP: (name) => new Promise((resolve, reject) => {
		fs.readFile(name,  'utf8', function(err, data) {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	}),

	writeStringToFileP: (buffer, name) => new Promise((resolve, reject) => {
		fs.writeFile(name, buffer,  'utf8', function(err) {
			if(err) {
				reject(err)
			} else {
				resolve()
			}
		})
	}),

	writeBufferToFileP: (buffer, name) => new Promise((resolve, reject) => {
		fs.writeFile(name, buffer, function(err) {
			if(err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})
}

export default FileUtils
