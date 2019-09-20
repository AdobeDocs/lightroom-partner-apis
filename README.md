# The Lightroom APIs

Adobe Photoshop Lightroom stores user **assets**, with their associated metadata and media renditions, in a **catalog** in the cloud. An asset may be grouped together with others into an **album**. An asset is included by reference through an **album asset** that encapsulates information of the asset that is specific to that album. This mechanism enables a single asset to be in an indefinite number of albums. Albums can be grouped with others into **album sets** to form a nested album hierarchy. Unlike assets, an album can be in one and only one album set.

## Accessing Lightroom Content

Lightroom content of a Creative Cloud customer is managed through a set of RESTful APIs. These APIs are available only to entitled clients that have authenticated the customer, and the customer has given their express permission for the client to act on their behalf.

## Registering as an Adobe Partner

Partners must register a new **integration** with Adobe to obtain a unique **API Key** (client identifier) for their application. Partner applications that use the API Key are entitled to authenticate Lightroom customers and access their content, after the customers have formally given their consent. Instructions for this process can be found under [Getting Started](docs/01-getting-started.md).

## Authenticating a Lightroom Customer

Partner applications authenticate Lightroom customers through the Adobe Identity Management System (IMS) using a standard OAuth 2.0 workflow. This process enables a client to secure an **Access Token** that must be included along with the integration API Key in privileged requests to the Lightroom APIs. Instructions for authenticating with IMS can be found under [Getting Started](docs/01-getting-started.md).
