import { ArchiveView } from "../view/common/archive-view";

export class BarcodeTemplateView extends ArchiveView {
    name?: string;
    totalLength?: string;
    numberOfMachineAssigned?:string;
    completed ?: boolean
    barcodeFileId?: number;
    password?:string;
    constructor(view?: BarcodeTemplateView) {
        super(view)
        if (view != undefined) {
            this.name = view.name;
            this.totalLength = view.totalLength;
            this.numberOfMachineAssigned=view.numberOfMachineAssigned;
            this.completed = view.completed
            this.password=view.password;
        }
    }
}