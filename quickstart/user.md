## Check Customer Entitlement and Catalog

Lightroom workflows should be attempted only for users who already have a Lightroom account with an active subscription and an existing catalog.

After a customer has [authenticated through the Adobe Identity Management System](./oauth.md), partner applications should retrieve the user account information to determine the subscription entitlement. If a user is entitled to Lightroom, partner applications should then check that the user has an active catalog.

If one of both of these checks fails, partner applications should provide appropriate feedback to the user and not attempt any additional calls to the Lightroom services.

### Check Subscription Entitlement

The call to retrieve the Lightroom account information of an authenticated customer will always succeed, barring network or service interruptions. The retrieved account `entitlement.status` must be `subscriber` or `trial`. Other values indicate that a customer may be entitled to a different Adobe product, may have an expired subscription, or may never have subscribed to any product.

```
GET /v2/accounts/00000000000000000000000000000000
```

Sample success response:

```
{
    "id": "<account_id>",
    "type": "account",
    ...
    "entitlement": {
        "status": "<account_status>",
        "trial": {
            "start": "<trial_start_date>",
            "end": "<trial_end_date>"
        },
        ...
        "storage": {
            "used": <upload_usage_count>,
            "limit": <storage_limit>,
            "display_limit": <storage_display_limit>,
            "warn": <storage_warn_limit>
        },
        "deletion_date": "<deletion_date>"
    }
}
```

### Check Customer Catalog

Entitled Lightroom customers will have a catalog only if they have created one through one of the Lightroom client applications. Partner applications must check for the existence of a catalog with the call:

```
GET /v2/catalogs/00000000000000000000000000000000
```

This call will fail with a `404` if the user has no catalog; otherwise it will return the catalog information:

```
{
    "id": "<catalog_id>",
    "type": "catalog",
    ...
}
```
