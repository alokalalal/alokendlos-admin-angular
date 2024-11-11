import { ArchiveView } from "./archive-view";
import { KeyValueView } from "./key-value-view";
import { RoleModuleRightsView } from "./role-module-rights-view";

export class RoleView extends ArchiveView {
    public name! : String;
	public description! : String;
	public roleModuleRightsViews! : Array<RoleModuleRightsView>;
    public customerRole! : boolean;

    constructor(view? : RoleView){
        super(view);
        if(view != undefined){
            this.name = view.name
            this.description = view.description
            this.roleModuleRightsViews = view.roleModuleRightsViews
            this.customerRole=view.customerRole
        }
    }
}