const express = require('express')
const router = express.Router()
const Lr = require('./lr')
const bodyParser = require('body-parser');
router.use(bodyParser.raw({limit: '200mb'})) // middleware for uploading binaries

// endpoints that let a client application query Lightroom information directly
router.get('/get/:data', function(req, res) {
	let data = req.params.data
	let table = {
		health: Lr.util.getHealthP,
		account: Lr.util.getAccountP,
		catalog: Lr.util.getCatalogP
	}
	if (!data || !table[data]) {
		res.render('index', { response: '' })
		return
	}
	table[data](req.session.token)
		.then((response) => {
			return JSON.stringify(response, null, 4)
		})
		.catch((error) => {
			return error
		})
		.then((result) => {
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.render('index', { response: result })
		})
})

let LightroomUserDatabase = {
	_users: {},

	get: function(accountId) {
		return LightroomUserDatabase._users[accountId]
	},

	set: function(account, catalog) {
		let user = {
			timestamp: (new Date()).toISOString(), // when this user data was updated
			account_id: account.id,
			catalog_id: catalog.id,
			full_name: account.full_name,
			email: account.email,
			status: account.entitlement.status,
			storage_used: account.entitlement.storage.used,
			storage_limit: account.entitlement.storage.limit
		}
		return LightroomUserDatabase._users[account.id] = user
	}
}

let _currentUserP = async function(session) {
	if (session.account_id) {
		return Promise.resolve(LightroomUserDatabase.get(session.account_id))
	}

	let account = await Lr.util.getAccountP(session.token)
	let status = account.entitlement.status
	if (status !== 'trial' && status !== 'subscriber') {
		return Promise.reject('get user failed: not entitled')
	}
	let catalog = await Lr.util.getCatalogP(session.token)

	// if we have reached here, we have an entitled user with a catalog
	session.account_id = account.id // set the active user
	return LightroomUserDatabase.set(account, catalog) // add to the database
}

router.get('/user', function(req, res) {
	_currentUserP(req.session)
		.then((user) => {
			return JSON.stringify(user, null, 4)
		})
		.catch((error) => {
			return error
		})
		.then((result) => {
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.render('index', { response: result })
		})
})

router.get('/projects', function(req, res) {
	let _getProjectsP = (token, catalog_id) => {
		return Lr.util.getProjectsP(token, catalog_id)
			.then((response) => {
				return JSON.stringify(response, null, 4)
			})
	}
	_currentUserP(req.session)
		.then((user) => {
			return _getProjectsP(req.session.token, user.catalog_id)
		})
		.catch((error) => {
			return error
		})
		.then((result) => {
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.render('index', { response: result })
		})
})

let _getFirstProjectP = (token, catalog_id) => {
	return Lr.util.getProjectsP(token, catalog_id)
		.then((response) => {
			if (response.resources.length == 0) {
				return Promise.reject('Error: no first project')
			}
			return JSON.stringify(response.resources[0], null, 4)
		})
}

router.get('/projects/first', function(req, res) {
	_currentUserP(req.session)
		.then((user) => {
			return _getFirstProjectP(req.session.token, user.catalog_id)
		})
		.catch((error) => {
			return error
		})
		.then((result) => {
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.render('index', { response: result })
		})
})

router.get('/projects/first/create', function(req, res) {
	let _createFirstProjectP = (token, catalog_id) => {
		return _getFirstProjectP(token, catalog_id)
			.then((response) => {
				return Promise.reject('Error: first project already exists')
			}, (error) => {
				return Lr.util.createProjectP(token, catalog_id)
			})
	}
	_currentUserP(req.session)
		.then((user) => {
			return _createFirstProjectP(req.session.token, user.catalog_id)
		})
		.catch((error) => {
			return error
		})
		.then((result) => {
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.render('index', { response: result })
		})
})

router.put('/upload/image', function(req, res) {
	_currentUserP(req.session)
		.then((user) => {
			if (user.storage_used + req.body.length > user.storage_limit) {
				return Promise.reject('upload failed: insufficient storage')
			}
			let fileName = decodeURIComponent(req.query.file_name)
			return Lr.util.uploadImageP(req.session.token, user.account_id, user.catalog_id, fileName, req.body)
				.then((asset_id) => {
					return `upload succeeded: created asset ${asset_id}`
				})
		})
		.catch((error) => {
			return error
		})
		.then((result) => {
			res.send(result)
		})
})

router.put('/projects/first/upload/image', function(req, res) {
	_currentUserP(req.session)
		.then((user) => {
			if (user.storage_used + req.body.length > user.storage_limit) {
				return Promise.reject('upload failed: insufficient storage')
			}
			let fileName = decodeURIComponent(req.query.file_name)
			return Lr.util.uploadImageAndAddToFirstProjectP(req.session.token, user.account_id, user.catalog_id, fileName, req.body)
				.then((asset_id) => {
					return `upload and add to album succeeded: created asset ${asset_id}`
				})
		})
		.catch((error) => {
			return error
		})
		.then((result) => {
			res.send(result)
		})
})

module.exports = router
