import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDateFormats, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialElevationDirective } from './directive/material-elevation.directive';
import { MatChipsModule } from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatListModule,
        MatSlideToggleModule,
        MatTableModule,
        MatSortModule,
        CdkTableModule,
        MatDialogModule,
        MatMenuModule,
        MatBadgeModule,
        MatSnackBarModule,
        MatCardModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        NgxMatSelectSearchModule,
        MatChipsModule,
        MatTooltipModule
    ],
    exports: [
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatListModule,
        MatSlideToggleModule,
        MatTableModule,
        MatSortModule,
        CdkTableModule,
        MatDialogModule,
        MatMenuModule,
        MatBadgeModule,
        MatSnackBarModule,
        MatCardModule,
        MaterialElevationDirective,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        NgxMatSelectSearchModule,
        MatChipsModule,
        MatTooltipModule
    ],
    declarations:[
        MaterialElevationDirective
    ]
})

export class AppMaterialModule { }

export class AppDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === "input") {
            let day: string = date.getDate().toString();
            day = +day < 10 ? 0 + day : day;
            let month: string = (date.getMonth() + 1).toString();
            month = +month < 10 ? 0 + month : month;
            let year = date.getFullYear();
            return `${year}-${month}-${day}`;
        }
        return date.toDateString();
    }
}
export const APP_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: { month: "short", year: "numeric", day: "numeric" },
    },
    display: {
        dateInput: "input",
        monthYearLabel: { year: "numeric", month: "numeric" },
        dateA11yLabel: {
            year: "numeric", month: "long", day: "numeric"
        },
        monthYearA11yLabel: { year: "numeric", month: "long" },
    }
};
