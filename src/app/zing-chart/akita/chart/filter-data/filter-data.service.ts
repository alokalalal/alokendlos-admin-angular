import { Injectable } from '@angular/core';
import { MachineView } from 'src/app/entities/machine-view';
import { FilterDataEntity } from './filter-data.entity';
import { FilterDataQuery } from './filter-data.query';
import { FilterDataStore } from './filter-data.store';


@Injectable({ providedIn: 'root' })
export class FilterDataService {

    constructor(private filterDataStore: FilterDataStore, private filterDataQuery: FilterDataQuery) { }

    set(filterDataEntity: FilterDataEntity) {
        this.filterDataStore.add(filterDataEntity);
    }

    update(id: string, industryEntity: Partial<FilterDataEntity>) {
        this.filterDataStore.update(id, industryEntity);
    }

    addOrUpdate(id: string, filterData: any) {
        const filterDataEntityModel = this.filterDataQuery.get(id);
        if (filterDataEntityModel) {
            this.update(id, { filterData });
        } else {
            this.filterDataStore.add({ id, filterData });
        }
    }
}
