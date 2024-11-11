import { IdentifierView } from '../view/common/identifier-view';
import { CustomerView } from './customer-view';
import { LocationView } from './location-view';
import { MachineView } from './machine-view';


export class ReportView extends IdentifierView {
    customerView? : CustomerView;
    createDate : number;
    machineView: MachineView;
    locationView? : LocationView;
    aluBottleCount : number;
    glassBottleCount : number;
    totalValue : number;
    patBottleCount : number;
    totalBottleCount : number;
    bigGlassBottleCount : number;
    bigPatBottleCount : number;
    smallGlassBottleCount : number;
    smallPatBottleCount : number;
    totalSmallPatBottleCount : number;
    totalPatBottleCount : number;
    totalBigPatBottleCount : number;
    totalSmallGlassBottleCount : number;
    totalBigGlassBottleCount : number;
    totalGlassBottleCount : number;
    totalAluBottleCount : number;
    allTotalBottleCount : number;
    allTotalValue : number;

    constructor(view?: ReportView){
        super(view)
        if(view != undefined){
            this.customerView = view.customerView;
            this.createDate = view.createDate;
            this.machineView = view.machineView;
            this.locationView = view.locationView;
            this.aluBottleCount = view.aluBottleCount;
            this.glassBottleCount = view.glassBottleCount;
            this.totalValue = view.totalValue;
            this.patBottleCount = view.patBottleCount;
            this.totalBottleCount = view.totalBottleCount;
            this.bigGlassBottleCount = view.bigGlassBottleCount;
            this.bigPatBottleCount = view.bigPatBottleCount;
            this.smallGlassBottleCount = view.smallGlassBottleCount;
            this.smallPatBottleCount = view.smallPatBottleCount;
            this.totalSmallPatBottleCount = view.totalSmallPatBottleCount;
            this.totalPatBottleCount = view.totalPatBottleCount;
            this.totalBigPatBottleCount = view.totalBigPatBottleCount;
            this.totalSmallGlassBottleCount = view.totalSmallGlassBottleCount;
            this.totalBigGlassBottleCount = view.totalBigGlassBottleCount;
            this.totalGlassBottleCount = view.totalGlassBottleCount;
            this.totalAluBottleCount = view.totalAluBottleCount;
            this.allTotalBottleCount = view.allTotalBottleCount;
            this.allTotalValue = view.allTotalValue;
        }
    }
}