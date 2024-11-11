import { ModuleView } from "./module-view";
import { RightsView } from "./rights-view";
import { View } from "./view";

export class RoleModuleRightsView implements View {
    public rightsView: RightsView;
    public moduleView: ModuleView;

    constructor(view: RoleModuleRightsView) {
        this.rightsView = view.rightsView
        this.moduleView = view.moduleView
    }

}