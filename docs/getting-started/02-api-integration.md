# API Integration 

# Steps for setting up integration with Lightroom Partner APIs

 1. Create login for https://console.adobe.io using an email id. 
 2. Contact lightroom for product assignment. <span style="color:red">TODO review with team to understand how this can be done.</span>
 3. After login in using the created id, Click on Integrations. Navigate to "New integrations". Navigate to "Access an API".
 4. Under "Creative Cloud" offerings menu click on "Lightroom Partner APIS". Fill in the form with details to create integration. Provide redirect uri details here. This will be used for oAuth flow.
 5. Click on "integration details" to identify client key/API Key and client secret. These details will be needed in generating authorization token and refresh token. The redirect url can be modified here. 
 6. To be able to use the "Lightroom Partner APIs" and additional approval process is needed. Click on "Approvals" on the top menu bar and fill in the details of the form. Submit for review.
 
 
[Further documentation](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/AuthenticationOverview/OAuthIntegration.md)
 



