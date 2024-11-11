import { ArchiveView } from "../view/common/archive-view";
import { CustomerView } from "./customer-view";
import { LocationView } from "./location-view";
import { MachineView } from "./machine-view";
import { PickupRouteView } from "./pickup-route-view";

export class LogisticPickupLogsPerRouteView extends ArchiveView{
    pickupRouteView? : PickupRouteView;
    date?: number;
    numberOfPlasticBottlesInRoute?: number;
    numberOfAluminumBottlesInRoute?: number;
    numberOfGlassBottlesInRoute?: number;
    totalWeightOfRoute?: number;
    totalNumberOfPickups?: number;
    constructor(view?: LogisticPickupLogsPerRouteView) {
        super(view)
        if(view != undefined){
            this.pickupRouteView = view.pickupRouteView;
            this.date = view.date;
            this.numberOfPlasticBottlesInRoute = view.numberOfPlasticBottlesInRoute;
            this.numberOfAluminumBottlesInRoute = view.numberOfAluminumBottlesInRoute;
            this.numberOfGlassBottlesInRoute = view.numberOfGlassBottlesInRoute;
            this.totalWeightOfRoute = view.totalWeightOfRoute;
            this.totalNumberOfPickups = view.totalNumberOfPickups;
        }
    }
}