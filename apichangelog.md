## API Change Logs
This document provides information about new features and bug fixes with the Lightroom APIs.

### Version 1.1.0 (11 Jan, 2021)
- Added new Create Asset API (PUT)- `/v2/catalogs/{catalog_id}/assets/{asset_id}` . It can be used to create a new asset with initial metadata and import information.

- Existing Create Asset Revision API (PUT) - `/v2/catalogs/{catalog_id}/assets/{asset_id}/revisions/{revision_id}` is removed and will be deprecated soon. Please use above mentioned Create Asset API instead for creating asset.

- Added new Update Album API (POST)- `/v2/catalogs/{catalog_id}/albums/{album_id}`. It can be used to update an existing album. The existing album should be created via the same client app and of subtype project or project_set.

- Added new Delete Album API (DELETE)- `/v2/catalogs/{catalog_id}/albums/{album_id}`. It can be used to delete an existing album. The existing album should be created via the same client app and of subtype project or project_set.

- Added new Create External Develop XMP API (PUT)- `/v2/catalogs/{catalog_id}/assets{asset_id}/xmp/develop`. It can be used to upload external xmp develop file for an asset

- Added new Read External Develop XMP API (GET)- `/v2/catalogs/{catalog_id}/assets{asset_id}/xmp/develop`. It can be used to get latest external xmp develop file for an asset