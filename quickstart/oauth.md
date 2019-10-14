## OAuth Integration

Client applications are entitled to access Lightroom customer content through an _access token_ generated through a standard OAuth workflow. The OAuth integration is provided by the Adobe Identity Management System (IMS) and is supported across all Adobe services.

### Basic documentation for OAuth

[OAuth (auth code) integration](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/AuthenticationOverview/OAuthIntegration.md)

### API  documentation for Adobe Identity Management System APIS

[Authentication api to get authorization code](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/OAuth/OAuth.md)

Use scope=lr_partner_apis

[Access token and Refresh token](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/Resources/IMS.md) 

Use grant_type=authorization_code or grant_type=refresh_token only depending on the kind of token is needed.
Store the tokens on backend server only in a secured format with encryption at rest. 

[Exchange refresh token for a new access token](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/Resources/IMS.md)

The refresh token expires every 14 days. Before expiration of refresh token, a new access token and refresh token can be obtained using the existing refresh token. This can be used to make sure that the user does not need to login often.  

[Get new refresh token](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/Resources/IMS.md) 

![OAUTH flow diagram for Lightroom Partner Integration](../docs/images/OAuthFlowDiagram.png)

![IMS Token Usage](../docs/images/IMS_Authorization_flow.png)
