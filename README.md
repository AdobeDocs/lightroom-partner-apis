# Getting Started with the Lightroom APIs

Adobe Photoshop Lightroom stores user **assets**, with their associated metadata and media renditions, in a **catalog** in the cloud. An asset may be grouped together with others into an **album**. An asset is included by reference through an **album asset** that encapsulates information of the asset that is specific to that album. This mechanism enables a single asset to be in an indefinite number of albums. Albums can be grouped with others into **album sets** to form a nested album hierarchy. Unlike assets, an album can be in one and only one album set.

## Accessing Lightroom Content

Lightroom content for a Creative Cloud customer is managed through a set of RESTful APIs. These APIs are available only to entitled clients that have authenticated the customer, and the customer has given their express permission for the client to act on their behalf.

## Registering as an Adobe Developer

Partners that use the Lightroom APIs must register as an Adobe Developer to obtain permission for their client applications to authenticate Lightroom customers and access Creative Cloud content. Instructions for this process are provided through Adobe I/O.

Specifically, partners should use the Adobe I/O Console to create a new integration with the Creative Cloud (select the Creative SDK service). Each integration is identified by a unique API Key (Client ID).

## Authentication

Lightroom customers are authenticated through the Adobe Identity Management System with a standard OAuth 2.0 process described in the Adobe I/O authentication documentation. This process enables a client to secure an Access Token that must be included along with the integration API Key in every request to the Lightroom Cloud.

If you are browsing this at Github, here is an index and reading order:

* [Getting started with the Adobe Lightroom Partner API](docs/01-getting-started.md)
    - [Integration with Lightroom Partner APIS](docs/getting-started/02-api-integration.md)
    - [OAuth](docs/getting-started/03-oauth.md)
    - [Upload workflow](docs/getting-started/04-upload-workflow.md)
* [Adobe Lightroom Partner API Reference](docs/05-api-summary.md)
  + [API docs](docs/api/06-api-calls.md)
* [Frequently asked questions](docs/15-faq.md)
