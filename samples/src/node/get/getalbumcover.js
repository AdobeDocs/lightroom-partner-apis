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
const fs = require('fs')

let _writeBufferToFileP = (buffer, name) => new Promise((resolve, reject) => {
	fs.writeFile(name, buffer,  'binary', function(err) {
		if(err) {
			reject(err)
		} else {
			resolve()
		}
	})
})

async function mainP(albumId) {
	let lr = await LrSession.currentContextP()
	let album = await lr.getAlbumP(albumId)
	let buffer = await lr.getAlbumCoverP(album)
	if (buffer) {
		let name = `${albumId}.thumb.jpg`
		await _writeBufferToFileP(buffer, name)
		console.log('success: ', name)
	}
	else {
		console.log('success: no album cover')
	}
}

mainP(process.argv[2]).then(() => console.log('done')).catch(e => console.error('error:', e))
