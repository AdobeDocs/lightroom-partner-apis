# Calling a Lightroom API

As described [elsewhere](../docs/01-getting-started.md), applications must acquire an **API Key** by registering an **integration** as an Adobe partner. Using the API Key to authenticate a Lightroom customer with the Adobe Identity Management System enables the application to acquire an **Access Token**.

The API Key must be included in the `X-API-Key` header in every API call, while the access token must be included in the `Authorization: Bearer` header.

Sample cURL for calling an API might be:

```
key=ClientAPIKey
token=eyJ4NXUi...
curl -H "X-API-Key: ${key}" -H "Authorization: Bearer ${token}" https://lr.adobe.io/v2/...
```

and sample JavaScript might be:

```
var key='ClientAPIKey'
var token='eyJ4NXUi...'
var xhr = new XMLHttpRequest()
xhr.open('GET', apiURL)
xhr.setRequestHeader('X-API-Key', key)
xhr.setRequestHeader('Authorization', `Bearer ${token}`)
```

## Content Type

Lightroom content is encapsulated in a variety of objects, including **accounts**, **catalogs**, **assets**, and **albums**. The content type of every API is `JSON`, with the exception of the APIs that handle binary asset data (content type of the data) and those that handle external XMP Develop Settings (content type `application/rdf+xml`).

Returned JSON content is always prepended with a `while(1){}` clause to mitigate abuse. This clause must be stripped by client applications before using the incoming result.
