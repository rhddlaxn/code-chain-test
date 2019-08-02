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
    const address = tracer.state.address;
    if (address === undefined) {
        throw new Error("init 을 하세요 ");
    }
    if (args.length > 0) {
        from = parseInt(args[0], 10);
    } else {
        from = await sdk.rpc.chain.getBestBlockNumber();
    }
    for (let blockNumber = from; ; blockNumber++) {
        const block = await eventallyGetBlock(sdk, blockNumber);

        for (const tx of block.transactions) {

            tx.hash().toString();
            if (tx.unsigned.type() === "pay") {
                const { receiver, quantity }: {
                    receiver: PlatformAddress
                    quantity: U64
                }
                    = tx.unsigned as any;
                const sender = tx.getSignerAddress({
                    networkId: "wc",
                });
                if (sender.toString() ==
                    address.platformAddress.toString()) {
                    //내가 보낸 트랜잭션    
                    console.log({
                        type: "send",
                        receiver: receiver.toString(),
                        quantity: quantity.toLocaleString(),
                        fee: tx.unsigned.fee()!.toLocaleString(),
                    });

                } if (receiver.toString() ==
                    address.platformAddress.toString()) {
                    //내가 받은 트랜잭션
                    console.log({
                        type: "receive",
                        sender: sender.toString(),
                        quantity: quantity.toLocaleString(),
                    });

                }
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