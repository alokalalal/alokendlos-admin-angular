import { ArchiveView } from '../view/common/archive-view';
import { IdentifierView } from '../view/common/identifier-view';
import { MachineView } from './machine-view';

export class SystemSpecificationDetailView extends ArchiveView {

    anydeskId:string;
    anydeskPassword:string;
    windowsActivationKey: string;
    windowsProductionKey: string;
    windowsPassword: string;
    machineView: MachineView;
    dateOfCreated: number;
    dateOfUpdated: number;

    constructor(systemSpecificationDetailView?: SystemSpecificationDetailView) {
        
        super(systemSpecificationDetailView)

        if(systemSpecificationDetailView != undefined) {
            this.anydeskId = systemSpecificationDetailView.anydeskId;
            this.anydeskPassword = systemSpecificationDetailView.anydeskPassword;
            this.windowsActivationKey = systemSpecificationDetailView.windowsActivationKey;
            this.windowsProductionKey = systemSpecificationDetailView.windowsProductionKey
            this.windowsPassword = systemSpecificationDetailView.windowsPassword
            this.dateOfCreated = systemSpecificationDetailView.dateOfCreated;
            this.dateOfUpdated = systemSpecificationDetailView.dateOfUpdated;
            this.machineView = systemSpecificationDetailView.machineView;
        }
    }
}