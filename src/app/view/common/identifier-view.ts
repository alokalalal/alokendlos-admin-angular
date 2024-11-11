import { View } from "./view";

export abstract class IdentifierView implements View {
    public id! : number;

    constructor(view? : IdentifierView){
        if(view != undefined){
            this.id = view.id 
        }
    }
}