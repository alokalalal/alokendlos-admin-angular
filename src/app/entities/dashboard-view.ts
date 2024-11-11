import { ArchiveView } from "../view/common/archive-view";
import { IdentifierView } from "../view/common/identifier-view";
import { View } from "../view/common/view";
import { MachineView } from "./machine-view";

export class DashboardView extends IdentifierView{
    totalMachine?: string;
    readyMachine?: string;
    warningMachine?: string;
    errorMachine?: string;
    morethen90machine?:string;
    between60to90machine?:string;
    lessthen90machine?:string;
    totalValue?:string;
    totalBottle?:string;
    voucherBarcode?:string;
    machineView?: MachineView;
    totalPatBottleCount?:string;
    totalGlassBottleCount?:string;
    totalAluBottleCount?:string;
    totalPatBottleValue?:string;
    totalGlassBottleValue?:string;
    totalAluBottleValue?:string;

    constructor(view?: DashboardView){
        super(view)
        if(view != undefined){
            this.totalMachine = view.totalMachine;
            this.readyMachine = view.readyMachine;
            this.warningMachine = view.warningMachine;
            this.errorMachine = view.errorMachine;
            this.totalValue = view.totalValue;
            this.totalBottle = view.totalBottle;
            this.voucherBarcode = view.voucherBarcode;
            this.machineView = view.machineView;
            this.totalPatBottleCount=view.totalPatBottleCount;
            this.totalGlassBottleCount=view.totalGlassBottleCount;
            this.totalAluBottleCount=view.totalAluBottleCount;
            this.totalPatBottleValue=view.totalPatBottleValue;
            this.totalGlassBottleValue=view.totalGlassBottleValue;
            this.totalAluBottleValue=view.totalAluBottleValue;
        }
    }
}