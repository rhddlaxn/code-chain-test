import { SDK } from "codechain-sdk";
import { Tracer } from "../tracer";
import { Block, Pay, U64 } from "codechain-sdk/lib/core/classes";
import { PlatformAddress } from "codechain-primitives/lib";
export default async function watch(
    sdk: SDK,
    tracer: Tracer,
    args: string[]
) {
    let from;
    if (args.length > 0) {
        from = parseInt(args[0], 10);
    } else {
        from = await sdk.rpc.chain.getBestBlockNumber();
    }
    for (let blockNumber = from; ; blockNumber++) {
        const block = await eventallyGetBlock(sdk, blockNumber);
        console.log("block", block.number, block.hash.toString());
        for (const tx of block.transactions) {
            console.log("      tx", tx.unsigned.type(),
                tx.hash().toString());
            if (tx.unsigned.type() === "pay") {
                const { receiver, quantity }: {
                    receiver: PlatformAddress
                    quantity: U64
                }
                    = tx.unsigned as any;
                const sender = tx.getSignerAddress({
                    networkId: "wc",
                });
                console.log("       Sender: ", sender.toString());
                console.log("       Receiver", receiver.toString());
                console.log("       Quantity", quantity.toLocaleString());

            }


        }

    }
}


async function eventallyGetBlock(
    sdk: SDK,
    blockNumber: number,
): Promise<Block> {
    while (true) {
        const block = await sdk.rpc.chain.getBlock(blockNumber);
        if (block !== null) {
            return block;
        }
        await sleep(2000);
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}