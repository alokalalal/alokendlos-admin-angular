import { IdentifierView } from '../view/common/identifier-view';
import { KeyValueView } from '../view/common/key-value-view';
import { CustomerView } from './customer-view';
import { LocationView } from './location-view';
import { MachineView } from './machine-view';

export class MachineLogView extends IdentifierView {

    materialType: KeyValueView;
    materialCount:number;
    resetDate: number;
    createDate: number;
    machineView: MachineView;
    customerView: CustomerView;
    locationView: LocationView;
    hardResetDate:number;
    hardReset:boolean;
    startDate: number;
    endDate: number;
    constructor(machineLogView: MachineLogView) {
        super(machineLogView)
        this.materialType = machineLogView.materialType;
        this.materialCount = machineLogView.materialCount;
        this.resetDate = machineLogView.resetDate;
        this.createDate = machineLogView.createDate;
        this.machineView = machineLogView.machineView;
        this.customerView = machineLogView.customerView;
        this.locationView = machineLogView.locationView;
        this.hardResetDate = machineLogView.hardResetDate;
        this.hardReset = machineLogView.hardReset;
        this.startDate = machineLogView.startDate;
        this.endDate = machineLogView.endDate;
    }
}