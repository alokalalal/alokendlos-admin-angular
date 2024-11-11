import { UserView } from './../../view/common/user-view';
import { Injectable } from "@angular/core";
import { CurrentUserStore } from "./current-user-store";

@Injectable({ providedIn: 'root' })
export class CurrentUserStoreService {

    constructor(private currentUserStore: CurrentUserStore) { }

    set(user: UserView) {
        this.currentUserStore.update(user);
    }

    getCurrentUser(): UserView {
        return {...this.currentUserStore.getValue()};
    }

    delete() {
        this.currentUserStore.reset();
    }
}