import { Injectable } from "@angular/core";
import { StoreConfig } from "@datorama/akita";
import { AkitaStoreKey } from "src/app/constants/akita-store-key";
import { UserView } from "src/app/view/common/user";
import { AkitaEntityStateInterface } from "src/app/Interface/akita-entity-state-interface";
import { AkitaEntityStoreService } from "../akita.entity.store.service";

export interface AuthUserState extends AkitaEntityStateInterface<UserView> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({
    name: AkitaStoreKey.AUTH_USER
})
export class AuthUserEntityStoreService extends AkitaEntityStoreService<UserView, AuthUserState> {

}