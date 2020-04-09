/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
let LrUtils = {
	getAssetIdFromRevision: function(revision) {
		return revision.links['/rels/asset'].href.match(/assets\/([a-f0-9]{32})\/?/)[1]
	},

	getAssetAspectRatio: function(asset) {
		if (asset.payload.develop) {
			let width = asset.payload.develop.croppedWidth
			let height = asset.payload.develop.croppedHeight
			if (width && height) {
				return width / height
			}
		}
		else {
			let width = asset.payload.importSource.originalWidth
			let height = asset.payload.importSource.originalHeight
			if (width && height) {
				return width / height
			}
		}
		return 4 / 3
	},

	logAlbumAssetsP: async (lr, album, offset = '') => {
		let albumAssets = await lr.getAlbumAssetsP(album.id)
		albumAssets.forEach((albumAsset) => {
			let assetId = albumAsset.asset.id
			let remoteId = albumAsset.payload.publishInfo ? albumAsset.payload.publishInfo.remoteId : undefined
			console.log(`${offset}{ id: ${assetId}, remoteId: ${remoteId} }`)
		})
	},

	logAlbumP: async (lr, album, offset = '') => {
		let name = album.payload.name
		let remoteId = album.payload.publishInfo ? album.payload.publishInfo.remoteId : undefined
		console.log(`${offset}${album.subtype} { id: ${album.id}, name: ${name}, remoteId: ${remoteId} }`)
		if (album.subtype == 'project') {
			await LrUtils.logAlbumAssetsP(lr, album, offset + '  ')
		}
		else {
			let childAlbums = album._childAlbums || []
			for (const child of childAlbums) {
				await LrUtils.logAlbumP(lr, child, offset + '  ')
			}
		}
	},

	createAlbumHierarchy: function(root, albums) {
		albums.sort(function (a, b) {
			// alphabetical sort, with sets first
			if (a.subtype != b.subtype) {
				return a.subtype > b.subtype ? -1 : 1
			}
			return a.payload.name < b.payload.name ? -1 : 1
		})

		let albumSetHash = {}
		albums.forEach(function (album) {
			album._childAlbums = []
			if (album.subtype == 'collection_set' || album.subtype == 'project_set') {
				albumSetHash[album.id] = album
			}
		})

		albums.forEach(function (album) {
			let entry = album.payload.parent && albumSetHash[album.payload.parent.id]
			if (entry) {
				album._parent = entry
				entry._childAlbums.push(album)
			}
			else {
				album._parent = root
				root._childAlbums.push(album)
			}
		})
		return root
	},

	getRootCollectionSetP: async (lr) => {
		let albums = await lr.getAlbumsP('collection_set%3Bcollection')
		let root = {
			subtype: 'collection_set',
			payload: { name: 'Root Collection Set' },
			links: {},
			_childAlbums: []
		}
		return LrUtils.createAlbumHierarchy(root, albums)
	},

	getRootProjectSetP: async (lr) => {
		let albums = await lr.getAlbumsP('project_set%3Bproject')
		let root = {
			subtype: 'project_set',
			payload: { name: 'Root Project Set' },
			links: {},
			_childAlbums: []
		}
		return LrUtils.createAlbumHierarchy(root, albums)
	}
}

module.exports = LrUtils
