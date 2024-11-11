import { IdentifierView } from "./identifier-view";

export abstract class CreateView extends IdentifierView {
    public createDate!: string;
    public createBy!: string;
    public createById!: number;
    public thumbNailId!: string;

    constructor(view?: CreateView) {
        super(view);
        if(view != undefined){
            this.createDate = view.createDate
            this.createBy = view.createBy
            this.createById = view.createById
            this.thumbNailId = view.thumbNailId
        }
    }
}