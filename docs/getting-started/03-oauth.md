# OAuth integration

The OAuth integration is supported in a consistent way for adobe products. It is provided by the Adobe Identity Management System (IMS). 

![OAUTH flow diagram for Lightroom Partner Integration](../images/OAuthFlowDiagram.png)

### Basic documentation for OAuth

[OAuth (auth code) integration](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/AuthenticationOverview/OAuthIntegration.md)

[IMS tokens overview](https://wiki.corp.adobe.com/display/ims/Token+Overview)

[IMS token usage](https://wiki.corp.adobe.com/display/~smcevoy/Getting+Started%3A+IMS+Authorization+Code+Grant+Type)

[IMS javascript library](https://wiki.corp.adobe.com/display/~smcevoy/Getting+Started%3A+JavaScript+Clients+Using+imslib.js+and+React)


### API  documentation for Adobe Identity Management System APIS

[Authentication api to get authorization code](https://wiki.corp.adobe.com/display/ims/IMS+authorize+entry+point)

Use scope=lr_partner 

[Access token and Refresh token](https://wiki.corp.adobe.com/display/ims/IMS+API+-+token) 

Use grant_type=authorization_code or grant_type=refresh_token only depending on what kind of token is needed.

[Exchange refresh token for a new access token](https://wiki.corp.adobe.com/display/ims/IMS+API+-+token)

The refresh token expires in 14 days. Before expiration of refresh token, a new access token and refresh token can be obtained using the existing refresh token. This can be used to make sure that the user does not need to login often.  

[Get new refresh token](https://wiki.corp.adobe.com/display/ims/IMS+API+-+token) 

#### Further documentation is available below

[Authorization APIs](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/OAuth/OAuth.md)

[Authentication APIs](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/Resources/IMS.md)




