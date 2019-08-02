import { SDK } from "codechain-sdk";

import { Tracer } from "../tracer";

export default async function init(sdk: SDK, tracer: Tracer) {
    let address = tracer.state.address;
    if (address === undefined) {
        const platformAddress = await sdk.key.createPlatformAddress();
        const assetAddress = await sdk.key.createAssetAddress();
        address = { platformAddress, assetAddress };
        tracer.state.address = address;

        console.log("Created new accounts.");
    }

    console.log("Platform address:", address.platformAddress.toString());
    console.log("Asset address:", address.assetAddress.toString());
}
