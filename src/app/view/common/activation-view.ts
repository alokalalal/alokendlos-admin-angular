import { AuditableView } from "./auditable-view";

export abstract class ActivationView extends AuditableView {
    public active!: boolean;
    public activationDate!: string;
    public activationBy!: string;

    constructor(view?: ActivationView) {
        super(view)
        if(view != undefined){
            this.active = view.active
            this.activationDate = view.activationDate
            this.activationBy = view.activationBy 
        }
    }
}