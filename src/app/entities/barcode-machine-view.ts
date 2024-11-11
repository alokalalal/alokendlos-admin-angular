import { IdentifierView } from '../view/common/identifier-view';
import { BarcodeMachineItemView } from './barcode-machine-item-view';
import { FileView } from '../view/common/file-view';
import { ArchiveView } from '../view/common/archive-view';

export class BarcodeMachineView extends ArchiveView {
    

    public barcodeFileName: string;
    public noOfMachineAssigned: string;
    public totalNoOfBarcodes: string;
    public plastic: string;
    public glass: string;
    public alluminium: string;
    public fileView?: FileView;
    public fileStatus: string;
    barcodeMachineItemView?: BarcodeMachineItemView;
    public barcodeMachineId:number;

    constructor(machineBarcode?: BarcodeMachineView) {
        super(machineBarcode)
        if (machineBarcode != undefined) {
        this.barcodeFileName = machineBarcode.barcodeFileName;
        this.noOfMachineAssigned = machineBarcode.noOfMachineAssigned;
        this.totalNoOfBarcodes = machineBarcode.totalNoOfBarcodes;
        this.plastic = machineBarcode.plastic;
        this.glass = machineBarcode.glass;
        this.alluminium = machineBarcode.alluminium;
        this.fileView = machineBarcode.fileView;
        this.fileStatus = machineBarcode.fileStatus;
        this.barcodeMachineId = machineBarcode.barcodeMachineId;
        }
    }
}