import { SDK } from "codechain-sdk";
import { Tracer } from "../tracer";
import { PlatformAddress, U64 } from "codechain-primitives/lib";

export default async function sendCCC(
    sdk: SDK,
    tracer: Tracer,
    args: string[]
) {
    const address = tracer.state.address;
    if (address === undefined) {
        throw new Error("init 을 하세요");
    }
    const receiver = PlatformAddress.ensure(args[0]);
    const quantity = parseInt(args[1], 10);

    console.log(
        "sender: ", address.platformAddress.toString());
    console.log(
        "receiver: ", receiver.toString()
    );
    console.log(
        "Quantity: ", quantity.toLocaleString()
    );
    const pay = sdk.core.createPayTransaction({
        recipient: receiver,
        quantity,
    });
    const signedTx = await sdk.key.signTransaction(pay, {
        account: address.platformAddress,
        fee: 123,
        seq: await sdk.rpc.chain.getSeq(
            address.platformAddress),
    });
    const txHash = sdk.rpc.chain.sendSignedTransaction(signedTx);
    console.log("pay tx: ", txHash.toString());

}