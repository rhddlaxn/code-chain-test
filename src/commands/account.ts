import { SDK } from "codechain-sdk";
import { Tracer } from "../tracer";
import { PlatformAddress } from "codechain-primitives/lib";

export default async function account(
    sdk: SDK,
    tracer: Tracer,
    args: string[]
) {
    const address = tracer.state.address;
    if (address === undefined) {
        throw new Error("init 을 하세요");
    }
    console.log("Platform address:",
        address.platformAddress.toString());
    const ccc = await sdk.rpc.chain
        .getBalance(address.platformAddress);
    console.log("Balance : ",
        ccc.toLocaleString(), "ccc");

}
