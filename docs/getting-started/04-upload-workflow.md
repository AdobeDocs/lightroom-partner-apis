# Upload Workflow APIs

Refer to [API docs](../api/LightroomPartnerAPIsSpec.json) for api usage details.

1. Identify account details for the Lightroom user.
GET /{api_version}/accounts/00000000000000000000000000000000

2. Identify the Lightroom User's default catalog. 
GET /{api_version}/catalogs/00000000000000000000000000000000

3. Create an asset revision providing new GUID for asset_id and revision_id. Use catalog id as identified from response obtained from default catalog lookup. 
PUT /{api_version}/catalogs/{catalog_id}/assets/{asset_id}/revisions/{revision_id}

4. If the image to be uploaded requires a develop setting in the form of xmp file use the below API to upload the xmp file. 
PUT /{api_version}/catalogs/{catalog_id}/assets/{asset_id}/revisions/{revision_id}/xmp/develop

5. Upload image or video file using below api
PUT /{api_version}/catalogs/{catalog_id}/assets/{asset_id}/revisions/{revision_id}/master
