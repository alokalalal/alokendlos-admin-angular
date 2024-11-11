import { ArchiveView } from "../view/common/archive-view";
import { CustomerView } from "./customer-view";
import { LocationView } from "./location-view";
import { MachineView } from "./machine-view";
import { PickupRouteView } from "./pickup-route-view";

export class LogisticMaterialWeightView extends ArchiveView{
    averageWeightOfBottles?: string;
    weightInGrams? : number;
    comments? : string;
    dateOfUpdate?: number;
    constructor(view?: LogisticMaterialWeightView) {
        super(view)
        if(view != undefined){
            this.averageWeightOfBottles = view.averageWeightOfBottles;
            this.weightInGrams = view.weightInGrams;
            this.comments = view.comments;
            this.dateOfUpdate = view.dateOfUpdate

        }
    }
}