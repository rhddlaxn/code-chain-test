import * as fs from "fs";
import { PlatformAddress } from "codechain-primitives/lib";
import { AssetAddress } from "codechain-primitives/lib";
const SAVE_FILE = "state.json";

export type State = {
    nickname: string;
    address?: {
        platformAddress: PlatformAddress;
        assetAddress: AssetAddress;
    };
};

export class Tracer {
    public state: State;
    private constructor(state: State) {
        this.state = state;
    }
    public static load(): Tracer {
        const json = fs.readFileSync(SAVE_FILE, "utf-8");
        const obj = JSON.parse(json);
        let address;
        if (obj.address === undefined) {
            address = undefined;

        } else {
            address = {
                platformAddress: PlatformAddress.ensure
                    (obj.address.PlatformAddress),
                assetAddress:
                    AssetAddress.ensure(
                        obj.address.assetAddress)
            }
        }

        return new Tracer({
            nickname: obj.nickname,
            address,
        });
    }
    public save() {
        const obj: any = {};
        obj.nickname = this.state.nickname;
        if (this.state.address !== undefined) {
            obj.address = {
                PlatformAddress:
                    this.state.address
                        .platformAddress.toString(),
                assetAddress:
                    this.state.address
                        .assetAddress.toString(),
            }

        }
        const json = JSON.stringify(obj, null, 4);
        fs.writeFileSync(SAVE_FILE, json, "utf-8");
    }
}