import { CreateView } from "./create-view";

export abstract class AuditableView extends CreateView {
    public updateDate!: string;
    public updateBy!: string;

    constructor(view?: AuditableView) {
        super(view)
        if(view != undefined){
            this.updateDate = view.updateDate
            this.updateDate = view.updateDate 
        }
    }
}