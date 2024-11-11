import { IdentifierView } from "./identifier-view";

export class FileView extends IdentifierView{
    public moduleId? : number;
	public fileId? : string;
	public thumbNailId? : string;
	public name? : string;
	public originalName? : string;
	public thumbNailName? : string;
	public publicfile? : boolean;
	public bytes? : string;
	public compressName? : string;
    constructor(view: FileView){
        super(view)
        if(view != undefined){
            this.moduleId = view.moduleId;
            this.fileId = view.fileId;
            this.thumbNailId = view.thumbNailId;
            this.name = view.name;
            this.originalName = view.originalName;
            this.thumbNailName = view.thumbNailName;
            this.publicfile = view.publicfile;
            this.bytes = view.bytes;
            this.compressName = view.compressName;
        }
    }
}