## Generate Renditions (Only Fullsize/2560) for Print Workflow 

Generate renditions for an original file asynchronously. Allowed rendition types are fullsize and 2560. Generated rendition will be deleted after 1 day automatically.


##Workflow to generate renditions

_STEP 1_: Create an asset

```
PUT /v2/catalogs/{catalog_id}/assets/{asset_id} HTTP/1.1 
Authorization: {auth_token}
Content-Type: application/json
Content-Length: {xsd:nonNegativeInteger}
If-None-Match: {xsd:string}
{
	"subtype": "{asset_subtype}",
	"payload": {
		"captureDate": "0000-00-00T00:00:00",
		"importSource": {
			"fileName": "{file_name}",
			"importedOnDevice": "{import_device_name}",
			"importedBy": "{import_account_id}",
			"importTimestamp": "{import_time}"
		}
	}
}
```

Sample success response:

```
HTTP/1.1 201 
CreatedContent-Length: 0
Location: {xsd:anyURI}
```

_STEP 2_: Upload original for an asset.

```
PUT /v2/catalogs/{catalog_id}/assets/{asset_id}/master HTTP/1.1
Authorization: {auth_token}
Content-Length: {xsd:nonNegativeInteger}
Content-Range: {xsd:string}
Content-Type: {xsd:string}
```

Sample success response:

```
HTTP/1.1 201 
CreatedContent-Length: 0
Location: {xsd:anyURI}
```

_STEP 3_: Generate Renditions for an asset asynchronously. Allowed rendition types are fullsize and 2560

```
POST /v2/catalogs/{catalog_id}/assets/{asset_id}/renditions HTTP/1.1
Authorization: {auth_token}
X-Generate-Renditions: {fullsize,2560}
```

Sample success response:

```
HTTP/1.1 202
```

_STEP 4_: Read asset. Check for rendition links (/links/rels/rendition/<rendition_type>) in the asset response. Keep reading asset with some delay till renditions links are present. 

```
GET /v2/catalogs/{catalog_id}/assets/{asset_id} HTTP/1.1
Authorization: {auth_token}
```

Sample success response:

```
HTTP/1.1 200
```

_STEP 5_: Once the rendition links (/links/rels/rendition/<rendition_type>) are populated in the asset response, then that means that rendition has been generated correctly. Now call the read rendition api to get the rendition. 

```
GET /v2/catalogs/{catalog_id}/assets/{asset_id}/renditions/<rendition_type> HTTP/1.1
Authorization: {auth_token}
```

Sample success response:

```
HTTP/1.1 200
```

### Generate Renditions diagrams
![Generate Renditions for Lightroom Assets](../docs/images/GenerateRenditions.png)

NOTE: Refer to the API documentation for further information about above listed APIs.
