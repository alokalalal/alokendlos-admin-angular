import { IdentifierView } from '../view/common/identifier-view';
import { KeyValueView } from '../view/common/key-value-view';
import { CustomerView } from './customer-view';
import { LocationView } from './location-view';
import { MachineView } from './machine-view';

export class MqttConfigurationView extends IdentifierView {

    mqttBridgeHostName: string;
    mqttBridgePort:string;
    projectId: string;
    cloudRegion: string;
    registryId:string;
    gatewayId:string;
    privateKeyFilePath:string;
    algorithm:string;
    deviceId:string;
    messageType:string;
    createDate:number;
    machineView: MachineView;
    customerView: CustomerView;
    locationView: LocationView;

    constructor(mqttConfigurationView: MqttConfigurationView) {
        super(mqttConfigurationView)
        this.mqttBridgeHostName = mqttConfigurationView.mqttBridgeHostName;
        this.mqttBridgePort = mqttConfigurationView.mqttBridgePort;
        this.projectId = mqttConfigurationView.projectId;
        this.cloudRegion = mqttConfigurationView.cloudRegion;
        this.registryId = mqttConfigurationView.registryId;
        this.gatewayId = mqttConfigurationView.gatewayId;
        this.privateKeyFilePath = mqttConfigurationView.privateKeyFilePath;
        this.algorithm = mqttConfigurationView.algorithm;
        this.deviceId = mqttConfigurationView.deviceId;
        this.messageType = mqttConfigurationView.messageType;
        this.createDate = mqttConfigurationView.createDate;
        this.machineView = mqttConfigurationView.machineView;
        this.customerView = mqttConfigurationView.customerView;
        this.locationView = mqttConfigurationView.locationView;
    }
}