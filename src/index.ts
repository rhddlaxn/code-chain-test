import * as process from "process";
import hello from "./commands/hello";
import { Tracer } from "./tracer";
import { SDK } from "codechain-sdk";
import init from "./commands/init";
import { access } from "fs";
import account from "./commands/account";
import sendCCC from "./commands/sendCCC";
import watch from "./commands/watch";
//console.log(process.argv);
async function asyncmain() {


    const [command, ...args] = process.argv.slice(2);
    const sdk = new SDK({
        server: "https://corgi-rpc.codechain.io",
        networkId: "wc",
        keyStoreType: {
            type: "local",
            path: "./keystore.db",
        },
    });
    const tracer = Tracer.load();
    switch (command) {
        case "watch": await watch(sdk, tracer, args); break;
        case "sendCCC": await sendCCC(sdk, tracer, args); break;
        case "account": await account(sdk, tracer, args); break;
        case "init": await init(sdk, tracer); break;
        case "hello": await hello(sdk, tracer, args); break;
        default:
            throw new Error(`Invaild command ${command}`);

    }
    tracer.save();
}
asyncmain().catch(e => {
    console.error(e);
});

