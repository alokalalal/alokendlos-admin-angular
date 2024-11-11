import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ListenerService {
    private dashboard = new Subject<any>();

    constructor() { }

    public dashboardChanged() {
        this.dashboard.next();
    }

    public dashboardStatus(): Observable<any> {
        return this.dashboard.asObservable();
    }

}
