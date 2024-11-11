import { ArchiveView } from "../view/common/archive-view";

export class MachineBarcodeFileView extends ArchiveView {
   noOfMachineAssigned?: string;
    totalNoOfBarcodes?: number;
    plastic?: number;
    glass?: number;
    alluminium?: number;
    fileStatus?: string;
    fileName?: string;

    constructor(view?: MachineBarcodeFileView) {
        super(view)
        if (view != undefined) {
            this.id=view.id;
            this.noOfMachineAssigned = view.noOfMachineAssigned;
            this.totalNoOfBarcodes = view.totalNoOfBarcodes;
            this.plastic=view.plastic;
            this.glass = view.glass;
            this.alluminium = view.alluminium;
            this.fileStatus = view.fileStatus;
            this.fileName = view.fileName;
        }
    }
}