import { UserView } from './../../view/common/user-view';
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { CurrentUserStore } from "./current-user-store";

@Injectable({ providedIn: 'root' })
export class CurrentUserStoreQuery extends Query<UserView> {
    currentUser$ = this.select(state => state);

    constructor(protected store: CurrentUserStore) {
        super(store);
    }
}