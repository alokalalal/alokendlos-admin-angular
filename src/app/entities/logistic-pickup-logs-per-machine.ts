import { ArchiveView } from "../view/common/archive-view";
import { CustomerView } from "./customer-view";
import { LocationView } from "./location-view";
import { MachineView } from "./machine-view";
import { PickupRouteView } from "./pickup-route-view";

export class LogisticPickupLogsPerMachineView extends ArchiveView{
    customerView? : CustomerView;
    locationView? : LocationView;
    machineView? : MachineView;
    pickupRouteView? : PickupRouteView;
    date?: number;
    numberOfPlasticBottlesInPickup?: number;
    numberOfAluminumBottlesInPickup?: number;
    numberOfGlassBottlesInPickup?: number;
    totalWeightOfPickupInKg?: number;
    constructor(view?: LogisticPickupLogsPerMachineView) {
        super(view)
        if(view != undefined){
            this.customerView = view.customerView;
            this.locationView = view.locationView;
            this.machineView = view.machineView;
            this.pickupRouteView = view.pickupRouteView;
            this.date = view.date;
            this.numberOfPlasticBottlesInPickup = view.numberOfPlasticBottlesInPickup;
            this.numberOfAluminumBottlesInPickup = view.numberOfAluminumBottlesInPickup;
            this.numberOfGlassBottlesInPickup = view.numberOfGlassBottlesInPickup;
            this.totalWeightOfPickupInKg = view.totalWeightOfPickupInKg;
        }
    }
}