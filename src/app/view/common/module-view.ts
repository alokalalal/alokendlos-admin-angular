import { IdentifierView } from "./identifier-view";
import { RightsView } from "./rights-view";

export class ModuleView extends IdentifierView {
    public name!: String;
    public rightsViews!: Array<RightsView>;

    constructor(view: ModuleView) {
        super(view);
        this.name = view.name
        this.rightsViews = view.rightsViews
    }
}