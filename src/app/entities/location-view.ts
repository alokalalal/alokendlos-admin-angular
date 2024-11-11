import { KeyValueView } from 'src/app/view/common/key-value-view';
import { ArchiveView } from "../view/common/archive-view";
import { CustomerView } from './customer-view';
import { MachineView } from './machine-view';
import { PickupRouteView } from './pickup-route-view';

export class LocationView extends ArchiveView {
    public name?: string
    public customerView?: CustomerView
    public address?: string
    public area?: string
    public countryView: KeyValueView = new KeyValueView({ key: "" })
    public stateView?: KeyValueView = new KeyValueView({ key: "" })
    public cityView?: KeyValueView = new KeyValueView({ key: "" })
    public machineView?: KeyValueView = new KeyValueView({ key: "" })
    public stateName?: string
    public cityName?: string
    public pincode?: string
    public latitude?: string
    public longitude?: string
    public altitude?: string
    public branchNumber?: string
    public machineViews: MachineView

    // logistic
    //public pickupRouteView: KeyValueView = new KeyValueView({ key: "" })
    pickupRouteView? : PickupRouteView;
	public positionRoute:number;
	public workDuringWeekends:boolean;
	public pickupEveryday:boolean;
	public numberOfGlassTanks:number;
	public glassFullnessPercentageForPickup:number;
    

    constructor(view?: LocationView) {
        super(view)
        if (view != undefined) {
            this.name = view.name
            this.customerView = view.customerView
            this.address = view.address
            this.area = view.area
            this.countryView = view.countryView
            this.stateView = view.stateView
            this.stateName = view.stateName
            this.cityView = view.cityView
            this.cityName = view.cityName
            this.pincode = view.pincode
            this.latitude = view.latitude
            this.longitude = view.longitude
            this.altitude = view.altitude
            this.branchNumber=view.branchNumber
            this.machineViews=view.machineViews
            this.machineView = this.machineView

            this.pickupRouteView = view.pickupRouteView
            this.positionRoute = view.positionRoute
            this.workDuringWeekends = view.workDuringWeekends
            this.pickupEveryday = view.pickupEveryday
            this.numberOfGlassTanks = view.numberOfGlassTanks
            this.glassFullnessPercentageForPickup = view.glassFullnessPercentageForPickup
        }
    }
}
