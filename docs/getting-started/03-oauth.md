# OAuth integration

![OAUTH flow diagram](../images/OAuthFlowDiagram.png)

### Basic documentation for OAuth

[OAuth (auth code) integration](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/AuthenticationOverview/OAuthIntegration.md)

### API  documentation for Lightroom Identity Management System APIS

[Authentication APIs](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/Resources/IMS.md)

[Authorization APIs](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/OAuth/OAuth.md)


### Usage of refresh token. 

The refresh token can be used to get a new access token and refresh token from Lightroom IMS. 
However the refresh token expires every 14 days. Make sure to retrieve a new refresh token before expiration to avoid the user login again.