## Authentication Example

Adobe I/O authentication is covered in depth in the Adobe I/O documentation. The only unique difference for Lightroom Services is the requirement to use `lr_partner_apis` in the requested scopes. 

The sample code here is based on the [OAuth 2.0 Example: Node.js](https://github.com/AdobeDocs/adobeio-auth/blob/master/OAuth/samples/adobe-auth-node) that can be found on GitHub.

To run this sample locally, clone that repository and replace the `creative_sdk` scope in _server/index.js_ with `lr_partner_apis`. Then follow the instructions in the ReadMe to run the application.

Authorization through the Adobe Identify Management System is working as expected if a user is able to successfully log in and view their profile information. This step is prerequisite for the other examples in this repository.
