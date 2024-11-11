import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FilterDataEntity } from './filter-data.entity';
import { FilterDataStore } from './filter-data.store';

@Injectable({ providedIn: 'root' })
export class FilterDataQuery extends QueryEntity<FilterDataEntity> {
    industry$ = this.select(state => state);
    station$ = this.select(state => state);

    constructor(protected store: FilterDataStore) {
        super(store);
    }
    
    get(id: string): FilterDataEntity | undefined {
        return this.getEntity(id);
    }
}
