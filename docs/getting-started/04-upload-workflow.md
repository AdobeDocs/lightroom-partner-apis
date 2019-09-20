# Upload Workflow APIs

Refer to [API docs](../api/LightroomPartnerAPIsSpec.json) for api usage details. 

1. Identify account details for the Lightroom user.
GET /v2/accounts/00000000000000000000000000000000

2. Identify the Lightroom User's default catalog. 
GET /v2/catalogs/00000000000000000000000000000000

#####For all below apis catalog_id must be provided. Do not provide 00000000000000000000000000000000 for catalog_id.

3. Create an asset revision providing new GUID for asset_id and revision_id. Use catalog id as identified from response obtained from default catalog lookup. 
PUT /v2/catalogs/{catalog_id}/assets/{asset_id}/revisions/{revision_id}

4. If the image to be uploaded requires a develop setting in the form of xmp file use the below API to upload the xmp file. 
PUT /v2//catalogs/{catalog_id}/assets/{asset_id}/revisions/{revision_id}/xmp/develop

5. Upload image or video file using below api
PUT /v2/catalogs/{catalog_id}/assets/{asset_id}/revisions/{revision_id}/master

5. Create project album to store images or videos for ease of search.  
PUT /v2/catalogs/{catalog_id}/albums/{album_id}

6. Lookup existing project albums
GET /v2/catalogs/{catalog_id}/albums?embed={string}&name_after={name_after}&limit={integer}&subtype={subtype}

7. Add images/videos to project album
PUT /v2/catalogs/{catalog_id}/albums/{album_id}/assets?album_asset_id={album_asset_id}&order={order}&cover={cover}

8. Health check 
GET /v2/version



#### Precondition checks

1. User doesn't have Lightroom login but has an adobe id. This can happen if the user has login for an adobe product different from lightroom 
OR User has lightroom login but with no valid subscription.
OR User has lightroom login but usage quota exceeded  
####Symptom : 
When a call is made to GET /{api_version}/accounts/00000000000000000000000000000000
Expect a 200 response but response body element entitlement.status is not "subscriber" or "trial". 
OR entitlement.storage used >=  limit or calculate usage to check. 

####Expected Partner Application Behavior :
Do not attempt any other Lightroom Partner APIs. 


2. User has lightroom account but no lightroom catalog.
   
####Symptom : 
When a call is made to GET /{api_version}/accounts/00000000000000000000000000000000
Expect a 200 response but response body element entitlement.status is "subscriber" and quota is not exceeded 
Next when a call is made to lookup the user's catalog GET /{api_version}/catalogs/00000000000000000000000000000000
Expect a 404 response.

####Expected Partner Application Behavior :
Do not attempt any other Lightroom Partner APIs. 


#### Uplopad workflow error scenarios TODO Work in progress 


1. API request received with bad API Key/Client id. 
####Symptom : 
When a call is made to GET /v2/version or any other Lightroom Partner API
Expect a 403 response with below response body
{"error_code":"403003","message":"Api Key is invalid"}

####Expected Partner Application Behavior :
Use correct client id for X-api-key header before attempting Lightroom Partner APIs.


2. API request received with expired token.
####Symptom : 
When a call is made any available API
Expect response
HTTP/1.1 403 Forbidden
{
    "code": 4300,
    "description": "Access is forbidden"
}

####Expected Partner Application Behavior :
Generate new access token before attempting calls to Lightroom Partner APIs.


3. API request received without access token.
####Symptom : 
When a call is made any available API
Expect response
HTTP/1.1 401 Unauthorized


####Expected Partner Application Behavior :
Provide access token before attempting calls to Lightroom Partner APIs.


4. Quota exceeded error. 
####Symptom :
when a call is made to PUT /v2/catalogs/{catalog_id}/assets/{asset_id}/revisions/{revision_id}/master

HTTP/1.1 413 Request Entity Too Large
Content-Type: application/json
Content-Length: {xsd:nonNegativeInteger}
{
    "code": 1007,
    "description": "The resource is too big"
}


HTTP/1.1 415 Unsupported Media Type
Content-Type: application/json
Content-Length: {xsd:nonNegativeInteger}
{
    "errors": {
        "content_type": [
            "should match the subtype of the asset"
        ]
    },
    "code": 1003,
    "description": "Invalid content type"
}

####Expected Partner Application Behavior :
Stop all further Lightroom Partner API calls.


5. Content type mismatch error. 
####Symptom :
when a call is made to PUT /v2/catalogs/{catalog_id}/assets/{asset_id}/revisions/{revision_id}/master

HTTP/1.1 415 Unsupported Media Type
Content-Type: application/json
Content-Length: {xsd:nonNegativeInteger}
{
    "errors": {
        "content_type": [
            "should match the subtype of the asset"
        ]
    },
    "code": 1003,
    "description": "Invalid content type"
}

####Expected Partner Application Behavior :
Skip the image or video for upload to Lightroom.

6. Http response code 5XX errors for any api call. 
####Symptom :
when a call is made to any Lightroom Partner APIs resulting in response with error code 5XX. 

####Expected Partner Application Behavior :
Stop all further Lightroom Partner API calls until GET /v2/version to check for success response with http response code 200. 

7. 



