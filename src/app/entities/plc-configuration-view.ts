import { IdentifierView } from '../view/common/identifier-view';
import { CustomerView } from './customer-view';
import { LocationView } from './location-view';
import { MachineView } from './machine-view';

export class PlcConfigurationView extends IdentifierView {

    plcAddressCDoorFrequency: string;
    plcAddressFcFrequency:string;
    barcodeScannerResponseWait: string;
    plcAddressPlasticShredderCurrent: string;
    plcAddressGlassShredderCurrent:string;
    plcAddressAluminiumShredderCurrent:string;
    plcAddressBcFrequency:string;
    objectDetectFirstResponseWait:string;
    plcAddressSlidingConveyorFrequency:string;
    plcIpAddress:string;
    createDate:number;
    machineView: MachineView;
    customerView: CustomerView;
    locationView: LocationView;

    constructor(plcConfigurationView: PlcConfigurationView) {
        super(plcConfigurationView)
        this.plcAddressCDoorFrequency = plcConfigurationView.plcAddressCDoorFrequency;
        this.plcAddressFcFrequency = plcConfigurationView.plcAddressFcFrequency;
        this.barcodeScannerResponseWait = plcConfigurationView.barcodeScannerResponseWait;
        this.plcAddressPlasticShredderCurrent = plcConfigurationView.plcAddressPlasticShredderCurrent;
        this.plcAddressGlassShredderCurrent = plcConfigurationView.plcAddressGlassShredderCurrent;
        this.plcAddressAluminiumShredderCurrent = plcConfigurationView.plcAddressAluminiumShredderCurrent;
        this.plcAddressBcFrequency = plcConfigurationView.plcAddressBcFrequency;
        this.objectDetectFirstResponseWait = plcConfigurationView.objectDetectFirstResponseWait;
        this.plcAddressSlidingConveyorFrequency = plcConfigurationView.plcAddressSlidingConveyorFrequency;
        this.plcIpAddress = plcConfigurationView.plcIpAddress;
        this.createDate = plcConfigurationView.createDate;
        this.machineView = plcConfigurationView.machineView;
        this.customerView = plcConfigurationView.customerView;
        this.locationView = plcConfigurationView.locationView;
    }
}