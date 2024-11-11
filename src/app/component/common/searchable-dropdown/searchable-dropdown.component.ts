import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'app-searchable-dropdown',
    templateUrl: './searchable-dropdown.component.html',
    styleUrls: ['./searchable-dropdown.component.scss']
})

export class SearchableDropdownComponent implements OnChanges {
    @ViewChild('searchableSelect', { static: true }) searchableSelect!: MatSelect;

    @Input() dropdownList!: any;
    @Input() searchableDropdownControl: FormControl = new FormControl();
    @Input() placeholder: string = '';
    @Input() initialValue: any;
    @Output() dropdownChangeEventEmitter = new EventEmitter();
    @Input() filteredDataModel: any;

    /** list of filteredList filtered by search keyword */
    public filteredList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}
    
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.dropdownList && (changes.dropdownList.previousValue != changes.dropdownList.currentValue)) {
            this.filterLists("");
            this.changeDetectorRef.detectChanges();
        }
        if(changes.initialValue && (changes.initialValue.previousValue != changes.initialValue.currentValue)){
            this.filteredDataModel = this.initialValue;
            this.changeDetectorRef.detectChanges();
        }
    }

    comparer(o1: any, o2: any): boolean {
        if (o1 && o2 && o1.id && o2.id) {
            return o1.id === o2.id;
        } else if(o1 && o2 && o1.key && o2.key){
            return o1.key === o2.key;
        }else{
            return false; 
        }
    }

    public filterLists(value: any) {
        if (!this.dropdownList) {
            return;
        }
        // get the search keyword
        let search = value;
        if (!search) {
            this.filteredList.next(this.dropdownList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the lists
        this.filteredList.next(
            this.dropdownList.filter((data: any) => data?.value ? data.value.toLowerCase().indexOf(search) > -1 : data.name.toLowerCase().indexOf(search) > -1)
        );
    }

}
