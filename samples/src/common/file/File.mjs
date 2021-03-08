/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import fs from 'fs'
import path from 'path'
import CryptoUtils from '../crypto/CryptoUtils.mjs'

let _subtypeGuess = function(filePath) {
	let videoExts = [
		'.mp4',
		'.MP4',
		'.mov',
		'.MOV',
		'.avi',
		'.AVI',
		'.mpg',
		'.MPG',
		'.m4v',
		'.M4V'
	]
	let fileext = path.extname(filePath)
	return videoExts.find((ext) => ext == fileext) ? 'video' : 'image'
}

let File = {

	streamP: (filePath, chunkSize, chunkHandlerP) => new Promise((resolve, reject) => {
		let offset = 0
		async function readableHandler() {
			let data
			while (null !== (data = stream.read(chunkSize))) {
				try {
					await chunkHandlerP(data, offset)
					offset += data.length
				} catch (err) {
					stream.destroy(err)
				}
			}
			stream.once('readable', readableHandler)
		}
		const stream = fs.createReadStream(filePath, { highWaterMark: chunkSize })
		stream.on('end', resolve)
		stream.on('error', reject)
		stream.once('readable', readableHandler)
	}),

	streamController: (filePath) => {
		return (chunkSize, chunkHandlerP) => File.streamP(filePath, chunkSize, chunkHandlerP)
	},

	fileP: async function(filePath) {
		let stats = await fs.promises.stat(filePath)
		let subtype = _subtypeGuess(filePath)
		let mime = subtype == 'video' ? 'application/octet-stream;video' : 'application/octet-stream' // or 'video/*'
		let sha256 = await CryptoUtils.sha256P(File.streamController(filePath))
		return {
			path: filePath,
			name: path.basename(filePath),
			ext: path.extname(filePath),
			mime: mime,
			subtype: subtype,
			parent: path.dirname(filePath),
			sha256: sha256,
			size: stats.size
		}
	},

	filesP: async function(dirPath) {
		let entries = await fs.promises.readdir(dirPath, { withFileTypes: true })
		let files = entries.filter((entry) => !entry.isDirectory())
		files = files.filter((file) => !(/^\./).test(file.name)) // skip hidden
		return Promise.all(files.map((file) => File.fileP(path.join(dirPath, file.name))))
	}

}

export default File
