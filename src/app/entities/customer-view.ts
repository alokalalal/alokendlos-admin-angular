import { ArchiveView } from "../view/common/archive-view";
import { FileView } from '../view/common/file-view';
import { UserView, UserViewTemplate } from "../view/common/user-view";
import { LocationView } from './location-view';

export class CustomerView extends ArchiveView {
    public name?: string
    public logo?: FileView
    public locationViews?: Array<LocationView>
    public userView?: UserView;

    constructor(view?: CustomerView) {
        super(view)
        if (view != undefined) {
            this.name = view.name
            this.logo = view.logo
            this.locationViews = view.locationViews
            this.userView = view.userView
        }
    }
}

export const CustomerViewTemplate = {
    'name':'',
    'logo':'',
    'locationView':'',
    'userView': UserViewTemplate,
}