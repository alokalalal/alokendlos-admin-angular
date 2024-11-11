import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { FilterDataEntity } from './filter-data.entity';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'filterData' })
export class FilterDataStore extends EntityStore<FilterDataEntity> {
    constructor() {
        super();
    }
}