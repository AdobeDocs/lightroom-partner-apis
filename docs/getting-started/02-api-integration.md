# API Integration 

# Steps for setting up integration with Lightroom Partner APIs

 1. Create a adobe login for https://console.adobe.io using an email id. 

 2. After logging in using the created Adobe id, Click on Integrations. Navigate to "New integrations". Navigate to "Access an API".

 3. Under "Creative Cloud" offerings menu click on "Lightroom Partner APIs". Fill in the form with details to create integration. Provide redirect URL details here. This will be used for OAuth flow.

 4. Click on "integration details" to identify client key/API Key and client secret. Take note of these values. These details will be needed in generating authorization code. If needed, redirect URL can be modified here. 

 5. To be able to use the "Lightroom Partner APIs" and additional approval process is needed. Click on "Approvals" on the top menu bar and fill in the details of the form. Submit for review.

 6. Once the client id is given access to use the “Lightroom Partner APIs” the approval process would be complete. At this point verify access to Lightroom Partner APIs. Use the health check endpoint https://lr.adobe.io/v2/version providing your client id generated in step 4 for X-API-Key header. 

 
 
[Further documentation](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/AuthenticationOverview/OAuthIntegration.md)
 



