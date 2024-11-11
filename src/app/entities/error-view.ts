import { IdentifierView } from '../view/common/identifier-view';
import { CustomerView } from './customer-view';
import { LocationView } from './location-view';
import { MachineView } from './machine-view';

export class ErrorView extends IdentifierView {
    errorName: string;
    resolveDate: number;
    createDate: number;
    resolve : boolean
    machineView: MachineView;
    customerView: CustomerView;
    locationView: LocationView;
    startDate: number;
    endDate: number;

    constructor(error?: ErrorView) {
        super(error)
        if (error != undefined) {
            this.errorName = error.errorName;
            this.machineView = error.machineView;
            this.resolveDate = error.resolveDate;
            this.createDate = error.createDate;
            this.resolve = error.resolve;
            this.customerView = error.customerView;
            this.locationView = error.locationView;
            this.startDate = error.startDate;
            this.endDate = error.endDate;
        }
    }
}