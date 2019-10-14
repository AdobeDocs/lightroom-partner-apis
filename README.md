## Lightroom Services

Adobe Photoshop Lightroom stores user _assets_, with their associated metadata and media renditions, in a _catalog_ in the cloud. An asset may be grouped together with others into an _album_. It is included by reference through an _album asset_ that encapsulates information of the asset that is specific to that album. This mechanism enables a single asset to be in an indefinite number of albums. Albums can be grouped with others into _album sets_ to form a nested album hierarchy. Unlike assets, an album can be in one and only one album set.

### Accessing Lightroom Content

Lightroom content of a Creative Cloud customer is managed through a set of RESTful APIs. These APIs are available only to entitled clients that have authenticated the customer, and the customer has given their express permission to the client to act on their behalf. The [API Reference](https://www.stage.adobe.io/apis/creativecloud/lightroom/apidocs.html) documents the available APIs.

Partners must register a new _integration_ with Adobe to obtain a unique client identifier (_API key_) for their application. Partner applications authenticate Lightroom customers through the Adobe Identity Management System (IMS) using a standard OAuth 2.0 workflow. This process enables a client to obtain an _access token_ that must be included along with the integration API Key in privileged requests to the Lightroom APIs.
