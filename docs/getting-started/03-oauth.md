# OAuth integration

The OAuth integration is supported in a consistent way for adobe products. It is provided by the Adobe Identity Management System (IMS). 

![OAUTH flow diagram for Lightroom Partner Integration](../images/OAuthFlowDiagram.png)

### Basic documentation for OAuth

[OAuth (auth code) integration](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/AuthenticationOverview/OAuthIntegration.md)


####IMS Token Overview:

#####Authorization codes:
An authorization code encapsulates all of the same information as an access token, but does not actually grant access to any resources; that is, you cannot use it to authorize a request for a protected resource. This adds another layer of security in the workflow. Instead of granting an access token directly, the ims/authorize/ call responds with an encrypted authorization code, which can be then send to ims/token/ in order to obtain the actual access token, along with a refresh token.

#####Access tokens:
An access token is a string representing a grant of authorization for a specific user and resource. Tokens have specific scopes and durations.

The access token provides an abstraction layer, replacing various authorization constructs such as username/password, with a single token understood by the resource server.

Once the user has been authenticated against the configured identity provider (IdP), IMS grants access of a specific type for specific services and resources, as specified by a scope value in the request.

An access token is good for a specific period of time (called the time to live, or TTL). It is given in milliseconds from the time the response was generated. For example, the client config setting access_token_expiry default value "86400000" means that the token is valid for 24 hours after generation. When the token has expired, you have to get a new one. Depending on your grant type, you either make a new authorization request or use a refresh token.

When the authenticated user needs to access a specific resource, your client sends the access token with the GET or PUT request to the resource server. It is up to the resource server that receives the token to validate it and check the user's entitlements before providing access. The resource server applies its own access rules, and grants or denies access to the specific resource.

#####Refresh tokens:
Like the authorization code, a refresh token encapsulates all of the same information as an access token, but does not actually grant access to any resources. You use it to get a new access token when the old one expires (access tokens may have a client-configured lifetime different than that authorized by the resource owner), or to obtain additional access tokens with identical or narrower scopes.

A refresh token is provided along with the access token in the Authorization Code grant type workflow.

![IMS Token Usage](../images/IMS_Authorization_flow.png)

### API  documentation for Adobe Identity Management System APIS

[Authentication api to get authorization code](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/OAuth/OAuth.md)

Use scope=lr_partner 

[Access token and Refresh token](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/Resources/IMS.md) 

Use grant_type=authorization_code or grant_type=refresh_token only depending on what kind of token is needed.

[Exchange refresh token for a new access token](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/Resources/IMS.md)

The refresh token expires in 14 days. Before expiration of refresh token, a new access token and refresh token can be obtained using the existing refresh token. This can be used to make sure that the user does not need to login often.  

[Get new refresh token](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/Resources/IMS.md) 





