import { ArchiveView } from "../view/common/archive-view";
import { KeyValueView } from "../view/common/key-value-view";
import { CustomerView } from "./customer-view";
import { LocationView } from "./location-view";
import { MachineView } from "./machine-view";
import { PickupRouteView } from "./pickup-route-view";

export class LogisticCurrentFullnessLogView extends ArchiveView{
    customerView? : CustomerView;
    locationView? : LocationView;
    machineView? : MachineView;
    pickupRouteView? : PickupRouteView;
    //public pickupRouteView: KeyValueView = new KeyValueView({ key: "" })
    date?: number;
    hoursFromLastTimeStempTillNow?: number;
    numberOfPlasticBinResetsSinceFullReset?: number;
    numberOfAluminumBinResetsSinceFullReset?: number;
    numberOfGlassBinResetsSinceFullReset?: number;
    numberOfPlasticBottlesSinceLastFullReset?: number;
    numberOfAluminumBottlesSinceLastFullReset?: number;
    numberOfGlassBottlesSinceLastFullReset?: number;
    totalWeightOfPickup?: number;
    totalNumberOfPickups?: number;


    generatePlanDate?: number;
	plannedNumberOfPatBottle?: number;
	plannedNumberOfAluBottle?: number;
	plannedNumberOfGlassBottle?: number;
	plannedTotalNumberOfPickup?: number;
	plannedTotalWeight?: number;
    constructor(view?: LogisticCurrentFullnessLogView){
        super(view)
        if(view != undefined){
            this.customerView = view.customerView;
            this.locationView = view.locationView;
            this.machineView = view.machineView;
            this.date = view.date;
            this.hoursFromLastTimeStempTillNow = view.hoursFromLastTimeStempTillNow;
            this.numberOfPlasticBinResetsSinceFullReset = view.numberOfPlasticBinResetsSinceFullReset;
            this.numberOfAluminumBinResetsSinceFullReset = view.numberOfAluminumBinResetsSinceFullReset;
            this.numberOfGlassBinResetsSinceFullReset = view.numberOfGlassBinResetsSinceFullReset;
            this.numberOfPlasticBottlesSinceLastFullReset = view.numberOfPlasticBottlesSinceLastFullReset;
            this.numberOfAluminumBottlesSinceLastFullReset = view.numberOfAluminumBottlesSinceLastFullReset;
            this.numberOfGlassBottlesSinceLastFullReset = view.numberOfGlassBottlesSinceLastFullReset;
            this.pickupRouteView = view.pickupRouteView;
            this.totalWeightOfPickup = view.totalWeightOfPickup;
            this.totalNumberOfPickups = view.totalNumberOfPickups;

            this.generatePlanDate = view.generatePlanDate;
            this.plannedNumberOfPatBottle = view.plannedNumberOfPatBottle;
            this.plannedNumberOfAluBottle = view.plannedNumberOfAluBottle;
            this.plannedNumberOfGlassBottle = view.plannedNumberOfGlassBottle;
            this.plannedTotalWeight = view.plannedTotalWeight;
            this.plannedTotalNumberOfPickup = view.plannedTotalNumberOfPickup;
        }
    }
}