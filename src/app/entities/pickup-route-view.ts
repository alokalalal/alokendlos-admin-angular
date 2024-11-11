import { ArchiveView } from "../view/common/archive-view";

export class PickupRouteView extends ArchiveView{
    pickupRouteId?: string;
    pickupRouteNo? : number
    area?: string;
    name?: string;
    comment?: string;
    pickupRoutecreateDate:number;
    constructor(view?: PickupRouteView){
        super(view)
        if(view != undefined){
            this.pickupRouteId = view.pickupRouteId;
            this.pickupRouteNo = view.pickupRouteNo;
            this.area = view.area;
            this.name = view.name;
            this.comment = view.comment;
            this.pickupRoutecreateDate = view.pickupRoutecreateDate;
        }
    }
}