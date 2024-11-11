import { ArchiveView } from "../view/common/archive-view";
import { CustomerView } from "./customer-view";
import { LocationView } from "./location-view";
import { MachineView } from "./machine-view";

export class DailyPickupAssigneeView extends ArchiveView{
    customerView?: CustomerView;
    locationView? : LocationView
    machineViews?: MachineView;
    lastPickupDate?: string;
    hoursFromPickup?: string;
    numbersOfGlassReset:number;
    numbersOfPatReset:number;
    numbersOfAluReset:number;
    totalBottles:number;
    totalVouchers:number;
    totalWeight:number;
    machineId:string;
    constructor(view?: DailyPickupAssigneeView){
        super(view)
        if(view != undefined){
            this.customerView = view.customerView;
            this.locationView = view.locationView;
            this.machineViews = view.machineViews;
            this.lastPickupDate = view.lastPickupDate;
            this.hoursFromPickup = view.hoursFromPickup;
            this.numbersOfGlassReset = view.numbersOfGlassReset;
            this.numbersOfPatReset = view.numbersOfPatReset;
            this.numbersOfAluReset = view.numbersOfAluReset;
            this.totalBottles = view.totalBottles;
            this.totalVouchers = view.totalVouchers;
            this.totalWeight = view.totalWeight;
            this.machineId=view.machineId;
        }
    }
}