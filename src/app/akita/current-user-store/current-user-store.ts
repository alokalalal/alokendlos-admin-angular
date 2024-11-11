import { UserView } from './../../view/common/user-view';
import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";
import { AkitaStoreKey } from "src/app/constants/akita-store-key";

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: AkitaStoreKey.CURRENT_USER, resettable: true })
export class CurrentUserStore extends Store<UserView> {
    constructor() {
        super({});
    }

}