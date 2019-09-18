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

5. Create project album to store images or videos for ease of search.  
PUT /{api_version}/catalogs/{catalog_id}/albums/{album_id}

6. Lookup existing project albums
GET /{api_version}/catalogs/{catalog_id}/albums?embed={string}&name_after={name_after}&limit={integer}&subtype={subtype}

7. Add images/videos to project album
PUT /{api_version}/catalogs/{catalog_id}/albums/{album_id}/assets?album_asset_id={album_asset_id}&order={order}&cover={cover}


#### Uplopad workflow error scenarios

<span style="color:red">TODO write about possible errors and expected partner side client behavior.</span>


1. User doesn't have Lightroom account


2. User has lightroom account but no lightroom catalog.


3. API request received with bad API Key/Client id. 


4. API request received with expired token.


5. User logged in but account has expired quota.


6. ??