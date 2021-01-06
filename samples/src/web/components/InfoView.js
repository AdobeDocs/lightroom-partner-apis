/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import './InfoView.css'

class InfoView {
	constructor() {
		this.element = document.createElement('div')

		let name = document.createElement('div')
		name.className = 'info'
		this._name = document.createTextNode('loading name...')
		name.appendChild(this._name)
		this.element.appendChild(name)

		let email = document.createElement('div')
		email.className = 'info'
		this._email = document.createTextNode('loading email...')
		email.appendChild(this._email)
		this.element.appendChild(email)

		let entitlement = document.createElement('div')
		entitlement.className = 'info'
		this._entitlement = document.createTextNode('loading entitlement...')
		entitlement.appendChild(this._entitlement)
		this.element.appendChild(entitlement)

		let status = document.createElement('div')
		status.className = 'info'
		this._status = document.createTextNode('loading status...')
		status.appendChild(this._status)
		this.element.appendChild(status)
	}

	set name(name) {
		let node = document.createTextNode(name)
		this._name.replaceWith(node)
		this._name = node
	}

	set email(email) {
		let node = document.createTextNode(email)
		this._email.replaceWith(node)
		this._email = node
	}

	set entitlement(entitlement) {
		let node = document.createTextNode(entitlement)
		this._entitlement.replaceWith(node)
		this._entitlement = node
	}

	set status(status) {
		let node = document.createTextNode(status)
		this._status.replaceWith(node)
		this._status = node
	}
}

export default () => new InfoView()
