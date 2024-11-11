import { IdentifierView } from "./identifier-view";

export class RightsView extends IdentifierView {
	public name! : String;

    constructor(view : RightsView){
        super(view);
        this.name = view.name
    }
}