/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import https from 'https'

let _toJSON = (body) => {
	if (body.length == 0) {
		return // catch empty body to avoid an error in JSON parser
	}
	let decoder = new TextDecoder('utf-8')
	var string = decoder.decode(body)
	let while1Regex = /^while\s*\(\s*1\s*\)\s*{\s*}\s*/ // strip off while(1){}
	return JSON.parse(string.replace(while1Regex, ''))
}

let _isJSON = (contentType) => contentType == 'application/json' || contentType == 'application/json;charset=utf-8'

let _onEnd = (status, contentType, body, resolve, reject) => {
	if (status < 200 || status > 299) {
		reject({
			statusCode: status,
			error: _toJSON(body)
		})
	}
	else {
		resolve(_isJSON(contentType) ? _toJSON(body) : body)
	}
}

let _browserRequestP = (options, data, signal) => new Promise((resolve, reject) => {
	if (options.method !== 'GET') {
		reject('only gets for now')
		return
	}
	let url = `${options.protocol}//${options.host}${options.path}`
	options = {
		method: options.method,
		cache: 'no-cache',
		headers: options.headers,
		signal
	}
	fetch(url, options).then(res => {
		let status = res.status
		let contentType = res.headers.get('content-type')
		res.arrayBuffer().then(body => _onEnd(status, contentType, body, resolve, reject))
	}).catch(reject)
})

let _nodeRequestP = (options, data, signal) => new Promise((resolve, reject) => {
	let req = https.request(options, (res) => {
		let chunks = []
		res.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
		res.on('end', () => _onEnd(res.statusCode, res.headers['content-type'], Buffer.concat(chunks), resolve, reject))
	}).on('error', reject).end(data)

	if (signal) {
		signal.onabort = () => req.destroy(new Error('aborted'))
	}
})

let node
try { node = process.versions.node } catch (err) {}

export default node ? _nodeRequestP : _browserRequestP
