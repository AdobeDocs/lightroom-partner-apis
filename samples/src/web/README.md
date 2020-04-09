## Web Samples

Tested with latest Safari and Chrome.

---

This directory contains various examples using the Lightroom Services APIs in a web application.

### Prerequisites

* Developers must create an application integration with the `Lightroom Services` as described in the [Adobe Lightroom developer documentation](https://www.adobe.io/apis/creativecloud/lightroom.html). This process will generate an `API Key` and `Client Secret`.

* Developers must acquire an OAuth 2.0 `user access token` for a Lightroom customer as detailed in the [Adobe Developer authentication documentation](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/OAuth/OAuth.md), with the `openid` and `lr_partner_apis` scopes.

* The samples acquire the API Key and user access token through the
`process.env.KEY` and `process.env.TOKEN` environment variables.
These are set by creating a `.env` file in the directory containing
this README:

      KEY='<integration API Key>'
      TOKEN='<user access token>'

* The samples are served through [Parcel](https://parceljs.org), which can be installed with npm:

      npm ci

### Samples

The `npx` command can be used to have Parcel package and host the given sample: `npx parcel <samplename>/index.html`. To view the sample, browse to http://localhost:1234/index.html.

* User Info

      npx parcel userinfo/index.html

    The application attempts to load the account and catalog information of the Lightroom user associated with the provided user access token. On success, some account information is displayed in the header. Otherwise, the reason for the failure is given.

* Asset Picker

    npx parcel assetpicker/index.html

    This example demonstrates browsing assets contained in collection and project hierarchies of an authenticated Adobe Lightroom customer.

    The application has a header, a horizontally-scrolling row for browsing through album hierarchies, and a region below to display the 2048 rendition of selected assets. The application first attempts to load the account and catalog information of the Lightroom user associated with the provided user access token. On success, some account information is displayed in the header.

    The collection and project hierarchies are shown in a horizontal scroller. Clicking an album will descend into its child albums (if it is an album set) or show its album assets (if it is a collection or project). Clicking on an album asset will present the corresponding 2048 rendition in a view below the album list.
