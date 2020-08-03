## Node Samples

Tested with node v13.6.0.

---

This directory contains various examples using the Lightroom Services APIs in a Node.js application.

### Prerequisites

* Developers must create an application integration with the `Lightroom Services` as described in the [Adobe Lightroom developer documentation](https://www.adobe.io/apis/creativecloud/lightroom.html). This process will generate an `API Key` and `Client Secret`.

* Developers must acquire an OAuth 2.0 `user access token` for a Lightroom customer as detailed in the [Adobe Developer authentication documentation](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/OAuth/OAuth.md), with the `openid` and `lr_partner_apis` scopes.

* The samples acquire the API Key and user access token through the
`process.env.KEY` and `process.env.TOKEN` environment variables. These can be passed into the application on the command line:

      KEY='<API Key>' TOKEN='<user access token>' node <sample.js>

### Samples

The samples are divided into different sub-directories of related kind. They leverage the modules found in the `../common` sibling directory for most of their operations.

* Health

  *     health/gethealth.js
    Query the health endpoint of the Lightroom Services and print the result the console.

* Get Content

  *     get/getalbum.js <album id>
    Fetch the album with the given identifier and print the result to the console.

  *     get/getalbumassets.js <album id>
    Fetch the album assets of the album with the given identifier and print the result to the console.

  *     get/getalbumcover.js <album id>
    Fetch the album cover of the album with the given identifier and print the result to the console.

  *     get/getasset.js <asset id>
    Fetch the asset with the given identifier and print the result to the console.

  *     get/getasset2048.js <asset id>
    Fetch the 2048 rendition of the asset with the given identifier and output the result to the file `<asset id>.2048.jpg`.

  *     get/getassetthumb.js <asset id>
    Fetch the thumbnail rendition of the asset with the given identifier and output the result to the file `<asset id>.thumb.jpg`.

  *     get/getcollections.js
    Fetch all albums of subtype `collection_set` and `collection` and print the result to the console.

  *     get/getfirstalbumasset.js <album id>
    Fetch the first album asset of the album with the given identifier and print the result to the console.

  *     get/getfirstasset.js
    Fetch the first asset in the catalog and print the result to the console.

  *     get/getincompletes.js
    Fetch all incomplete assets (assets that have been created but do not have a corresponding original or proxy) and print the result to the console.

  *     get/getprojects.js
    Fetch all albums of subtype `project_set` and `project` and print the result to the console.

* Upload Assets

  *     upload/uploadfile.js <file>
    Create a new asset and upload the file as its original. Skip the operation if a duplicate asset is detected.

* Connect Content

  *     connect/logconnector.js
    Fetch all albums of subtype `project_set` and `project`, as well as the album assets of projects, and print the hierarchy to the console.

  *     connect/createproject.js
    Fetch all albums of subtype `project_set` and `project`, as well as the album assets of projects, and print the hierarchy to the console.

  *     connect/connectdir.js <dir>
    Note: The sample assumes that the directory contains only media files and no subdirectories or non-media files.

    Upload all media files in the given directory, then create a new project album sharing the name of the directory and add all of the media files to the project album. Create a parent `project_set` of the new project album, named with a timestamp. Prints the result of the hierarchy to the console.

    If duplicates are found for any of the media files, the upload is skipped, and the existing duplicate asset is added to the project album instead.

* Generate Renditions

  *     gen/gen2560.js <asset id>
    Generate 2560 rendition for the asset with the given identifier.

  *     gen/genfullsize.js <asset id>
    Generate fullsize rendition for an asset with the given identifier.

  *     gen/waitfor2560.js <asset id>
    Wait for the 2560 rendition of the asset with the given identifier to be available. It will poll up to ten times, once every three seconds before timing out.

  *     gen/waitforfullsize.js <asset id>
    Wait for the fullsize rendition of the asset with the given identifier to be available. It will poll up to ten times, once every three seconds before timing out.

  *     gen/getassetpriv.js <asset id>
    Fetch the asset with the given identifier using the private APIs.

  *     gen/logrendition.js <asset id>
    Print whether the asset with the given identifier has a valid 2560 rendition and whether it has a valid fullsize rendition.

  *     gen/getasset2560.js <asset id>
    Fetch the 2560 rendition of the asset with the given identifier and output the result to the file `<asset id>.2560.jpg`.

  *     gen/getassetfullsize.js <asset id>
    Fetch the fullsize rendition of the asset with the given identifier and output the result to the file `<asset id>.fullsize.jpg`.
