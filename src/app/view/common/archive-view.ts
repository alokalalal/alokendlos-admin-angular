import { ActivationView } from "./activation-view";

export abstract class ArchiveView extends ActivationView {
    public archive!: boolean;
    public archiveDate!: string;
    public archiveBy!: string;

    constructor(view?: ArchiveView) {
        super(view)
        if(view != undefined){
            this.archive = view.archive
            this.archiveDate = view.archiveDate
            this.archiveBy = view.archiveBy
        }
    }
}