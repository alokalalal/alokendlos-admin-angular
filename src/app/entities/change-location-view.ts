import { IdentifierView } from "../view/common/identifier-view";
import { BarcodeMachineView } from "./barcode-machine-view";
import { BarcodeTemplateView } from "./barcode-template-view";
import { CustomerView } from "./customer-view";
import { KeyValue } from "./key-value";
import { LocationView } from "./location-view";
import { MachineBarcodeFileView } from "./machine-barcode-file-view";
import { MachineView } from './machine-view';


export class ChangeLocationView extends IdentifierView{
    barcode: string;
    dateEnd: number;
    machineId: number;  
    bname: string;
    machineNo: number;
    timeStamp: number;
    resolve: string;
    changeLocationView: any;
    name?: string;
    machineView?: MachineView;
    locationView? : LocationView;
    oldBarcodeTemplateView?: BarcodeTemplateView;
    oldCustomerView?: CustomerView;
    oldLocationView?: LocationView;
    oldMachineBarcodeFileView?: BarcodeMachineView;

    oldBranchMachineNumber?: string;
    newBranchMachineNumber?: string;
    status?: KeyValue;
    requestDate?: number;
    responseDate?: number;
    customerView?: CustomerView;
    barcodeTemplateView?: BarcodeTemplateView
    barcodeMachineView?:BarcodeMachineView

    constructor(view?: ChangeLocationView) {
        super(view)
        if (view != undefined){
            this.barcode = view.barcode;
            this.dateEnd = view.dateEnd;
            this.name = view.name;
            this.machineView = view.machineView;
            this.locationView = view.locationView;
            this.oldCustomerView = view.oldCustomerView;
            this.oldLocationView = view.oldLocationView;
            this.status = view.status;
            this.requestDate = view.requestDate;
            this.responseDate = view.responseDate;
            this.customerView=view.customerView;
            this.oldBarcodeTemplateView=view.oldBarcodeTemplateView;
            this.barcodeTemplateView=view.barcodeTemplateView;
            this.oldBranchMachineNumber=view.oldBranchMachineNumber;
            this.newBranchMachineNumber=view.newBranchMachineNumber;
            this.oldMachineBarcodeFileView = view.oldMachineBarcodeFileView;
        }
}
}
