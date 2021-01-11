## API Change Logs
This document provides information about new features and bug fixes with the Lightroom APIs.

### Version 1.1.0 (11 Jan, 2021)
- Added new PUT `/v2/catalogs/{catalog_id}/assets/{asset_id}` [api](https://www.stage.adobe.io/apis/creativecloud/lightroom/apidocs.html#/assets/createAsset)
 to create a new asset with initial metadata and import information.
- Existing create asset revision PUT api `/v2/catalogs/{catalog_id}/assets/{asset_id}/revisions/{revision_id}` will be deprecated soon. Please use new [create asset api](https://www.stage.adobe.io/apis/creativecloud/lightroom/apidocs.html#/assets/createAsset) instead for creating asset.