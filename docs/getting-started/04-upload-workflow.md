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


#### Uplopad workflow error scenarios TODO Work in progress 


1. User has doesn't have Lightroom account. This can happen if the user has login for an adobe product different from lightroom. 

####Symptom : 
When a call is made to GET /{api_version}/accounts/00000000000000000000000000000000
Expect a 404 response. 

####Expected Partner Application Behavior :
Do not attempt any other Lightroom apis. 


2. User has lightroom account but with no valid subscription. 

####Symptom : 
When a call is made to GET /{api_version}/accounts/00000000000000000000000000000000
Expect a 200 response but response body element entitlement.status is not "subscriber". 

####Expected Partner Application Behavior :
Do not attempt any other Lightroom apis. 

3. User has lightroom account but no lightroom catalog.

####Symptom : 
When a call is made to GET /{api_version}/accounts/00000000000000000000000000000000
Expect a 200 response but response body element entitlement.status is "subscriber".
Next when a call is made to lookup the user's catalog GET /{api_version}/catalogs/00000000000000000000000000000000
Expect a 404 response.

####Expected Partner Application Behavior :
Do not attempt any other Lightroom apis. 


4. User logged in but account has expired quota.


5. API request received with bad API Key/Client id. 


6. API request received with expired token.


7. ??