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
import LrContext from '../../common/lr/LrContext'
import LrUtils from '../../common/lr/LrUtils'

class AlbumGridView extends LitElement {

	static _lr // current lightroom session
	static _cache

	static setGlobals(session, account, catalog, preferredLanguage = 'en-US', singleSelect = false) {
		this._lr = new LrContext(session, account, catalog)
		this._cache = {}
	}

	static setImageManager(manager) {
		this._imageManager = manager
	}

	static get properties() {
		return {
			context: { type: String, reflect: true },
			_assets: { type: Array },
		}
	}

	constructor() {
		super()
		this._assets = []
	}

	static get styles() {
		return css`
			.container {
				width: 100%;
				height: 100%;
				overflow-x: hidden;
				overflow-y: auto;
			}
			.grid {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				box-sizing: border-box;
				padding: 1px;
				width: 100%;
			}
			img {
				margin: 1px;
				cursor: pointer;
			}
		`
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == 'context' && newValue) {
			const { source, preselected } = JSON.parse(newValue)

			if (!AlbumGridView._cache) {
				console.error('need to initialize album grid component')
				return
			}

			if (!AlbumGridView._cache[source.id]) {
				AlbumGridView._cache[source.id] = AlbumGridView._lr.getAlbumAssetsP(source.id)
			}
			AlbumGridView._cache[source.id].then((albumAssets) => {
				this._assets = albumAssets.map((albumAsset) => albumAsset.asset)
			})
		}
	}

	_onAssetClick(asset) {
		let selection = {
			selected: [ asset ],
			deselected: []
		}
		this.dispatchEvent(new CustomEvent('selected-changed', { detail: selection }))
	}

	_getCachedAssetThumbnailObjectURLP(asset) {
		if (AlbumGridView._imageManager) {
			return AlbumGridView._imageManager.getAssetThumbnailObjectURLP(asset)
		}
		return ''
	}

	render() {
		return html`<div class='container'><div class='grid'>
			${ this._assets.map((asset) => html`
				<img style=width:${ LrUtils.getAssetAspectRatio(asset) * 150 + 'px' };height:150px
					src=${ until(this._getCachedAssetThumbnailObjectURLP(asset), '') }
					@click=${ (event) => this._onAssetClick(asset) }>
				</img>
			`) }
		</div></div>`
	}
}

customElements.define('lr-samples-albumgrid', AlbumGridView)
