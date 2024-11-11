import { IdentifierView } from '../view/common/identifier-view';
import { MachineView } from './machine-view';

export class BarcodeView extends IdentifierView {
    machineView: MachineView;
    barcode: string;
    description: string;
    dataAcquisition: string;
    iteamRedeemValue: string;
    volumn: string;
    dateCreate: number;
    dateUpdate: number;

    constructor(barcode: BarcodeView) {
        super(barcode)
        this.machineView = barcode.machineView;
        this.barcode = barcode.barcode;
        this.description = barcode.description;
        this.dataAcquisition = barcode.dataAcquisition;
        this.iteamRedeemValue = barcode.iteamRedeemValue;
        this.volumn = barcode.volumn;
        this.dateCreate = barcode.dateCreate;
        this.dateUpdate = barcode.dateUpdate;
    }
}