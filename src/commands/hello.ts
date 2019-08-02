import { Tracer } from "../tracer";
import { SDK } from "codechain-sdk";

export default async function hello(
    sdk:SDK,
    tracer: Tracer,
    args: string[])
    {
    console.log(`hello, ${tracer.state.nickname}!`);
    if (args.length > 0) {
        const name = args[0];
        console.log(`이름이 ${name}(으)로 바뀌었네요!`);
        tracer.state.nickname = name;
        
    }
    const bestBlockNumber = 
        await sdk.rpc.chain.getBestBlockNumber();
        console.log("Best block number: ",
        bestBlockNumber);
        
}