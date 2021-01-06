/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/
import { LitElement, html, css } from 'lit-element'
import { until } from 'lit-html/directives/until.js'

class FolderGridView extends LitElement {
	static setImageManager(manager) {
		this._imageManager = manager
	}

	static _getAlbumCoverObjectURLP(album) {
		if (FolderGridView._imageManager) {
			return FolderGridView._imageManager.getAlbumCoverObjectURLP(album)
		}
		return ''
	}

	static get properties() {
		return {
			text: { type: String },
			folders: { type: Array },
			albums: { type: Array }
		}
	}

	constructor() {
		super()
		this.text = ''
		this.folders = []
		this.albums = []
	}

	static get styles() {
		return css`
			.picker {
				position: relative;
				width: 100%;
				height: 100%;
			}
			.breadcrumb {
				color: #777777;
				font-size: 14px;
				font-family: arial, sans-serif;
				font-weight: 100;
				line-height: 18px;
				margin-left: 5px;
				margin-top: 10px;
				height: 20px;
				cursor: pointer;
			}
			.grid {
				overflow-x: hidden;
				overflow-y: auto;
				position: absolute;
				top: 20px;
				left: 0px;
				bottom: 0px;
				width: 100%;
			}
			.slot {
				position: relative;
				top: 0px;
				width: 200px;
				height: 150px;
				margin: 5px;
				background: #bbbbbb;
				cursor: pointer;
			}
			.slot > p {
				position: absolute;
				width: 200px;
				height: 30px;
				top: 120px;
				color: #777777;
				font-size: 11px;
				font-family: arial, sans-serif;
				font-weight: 100;
				line-height: 18px;
				text-align: left;
				margin: 5px;
			}
			.slot > svg {
				position: absolute;
				width: 200px;
				height: 120px;
				top: 0px;
			}
			.slot > img {
				position: absolute;
				width: 200px;
				height: 120px;
				top: 0px;
				object-fit: cover;
			}
		`
	}

	set active(node) {
		this.folders = node.folders
		this.albums = node.albums
		this._parent = node.parent
		this.text = (node.parent ? '\u25C3 ' : '') + this._getName(node)
	}

	_onBreadcrumbClick(event) {
		if (this._parent) {
			this.active = this._parent
		}
	}

	_onClick(node) {
		if (node.folders || node.albums) {
			this.active = node
		}
		else {
			let selection = {
				selected: [ node.data ],
				deselected: []
			}
			this.dispatchEvent(new CustomEvent('selected-changed', { detail: selection }))
		}
	}

	_getName(node) {
		return node.data.payload.name
	}

	render() {
		return html`<div class='picker'>
			<div class='breadcrumb' @click=${ (event) => this._onBreadcrumbClick(event) }>
				${ this.text }
			</div>
			<div class='grid'>
				${ this.folders.map((node) => html`
					<div class='slot' @click=${ () => this._onClick(node) }>
						<p>${ this._getName(node) }</p>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-120 -150 300 300"><g><path fill="#777777" d="M58,12H36.7c-0.3,0-0.5-0.1-0.7-0.3l-6.2-6.2c-1-1-2.2-1.5-3.5-1.5H6c-3.3,0-6,2.7-6,6v44c0,3.3,2.7,6,6,6h52 c3.3,0,6-2.7,6-6V18C64,14.7,61.3,12,58,12z M62,54c0,2.2-1.8,4-4,4H6c-2.2,0-4-1.8-4-4V14h56c2.2,0,4,1.8,4,4V54z"></path></g></svg>
					</div>
				`)}
				${ this.albums.map((node) => html`
					<div class='slot' @click=${ () => this._onClick(node) }>
						<p>${ this._getName(node) }</p>
						<img src=${ until(FolderGridView._getAlbumCoverObjectURLP(node.data), '') }><img/>
					</div>
				`)}
			</div>
		</div>`
	}
}

customElements.define('lr-samples-foldergrid', FolderGridView)
