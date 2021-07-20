/* Replace "YOUR_ADOBE_API_KEY" with your Api key 
and "YOUR_ADOBE_API_SECRET" with your API Secret */

const adobeApiKey = "<client_id>";
const adobeApiSecret = "<cliend_secret>";

try {
        if (module) {
                module.exports = {
                        adobeApiKey: adobeApiKey,
                        adobeApiSecret: adobeApiSecret,
                }
        }
}
catch (err) {}
