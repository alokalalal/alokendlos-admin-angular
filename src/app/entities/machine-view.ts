import { TransactionView } from 'src/app/entities/transaction-view';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { ArchiveView } from "../view/common/archive-view";
import { BarcodeTemplateView } from './barcode-template-view';
import { CustomerView } from "./customer-view";
import { LocationView } from './location-view';
import { BarcodeMachineView } from './barcode-machine-view';

export class MachineView extends ArchiveView{
    machineId?: string;
    branchId?: string;
    machineName?: string;
    customerView? : CustomerView
    locationView? : LocationView
    transactionView? : TransactionView
    machineActivityStatus? : KeyValueView
    machineDevelopmentStatus? : KeyValueView
    aluBottlePercentage? : number
    glassBottlePercentage? : number
    patBottlePercentage? : number
    branchMachineNumber?: string;
    barcodeTemplateView?:BarcodeTemplateView;
    machineBarcodeFileView?:BarcodeMachineView;
    isSelect?: boolean;
    startDate?: number;
    endDate?: number;
    date?: number;
    machineType?: KeyValueView;
    plasticBinResetDate?:number;
    glassBinResetDate?:number;
    aluminiumnBinResetDate?:number;
    machineViews?:MachineView;
    patBottleCount?:number;
    glassBottleCount?:number;
    aluBottleCount?:number;
    password?:string;

    lastHardResetDate?:number;
    glassResetCount?:number;
    plasticResetCount?:number;
    aluminiumnResetCount?:number;
    totalBottleCount?:number;
    totalVoucher?:number;
    hoursFromPickup?:string;
    pickupEveryday?:boolean;
    binWeight?:number;
    materialWeight?:number;
    totalWight?:number;
    noGlassBinPickup?:number;
    acceptedMaterials?: Array<KeyValueView>

    constructor(view?: MachineView){
        super(view)
        if(view != undefined){
            this.machineId = view.machineId;
            this.branchId = view.branchId;
            this.machineName = view.machineName;
            this.customerView = view.customerView;
            this.locationView = view.locationView;
            this.transactionView = view.transactionView;
            this.machineActivityStatus = view.machineActivityStatus;
            this.machineDevelopmentStatus = view.machineDevelopmentStatus;
            this.aluBottlePercentage = view.aluBottlePercentage;
            this.glassBottlePercentage = view.glassBottlePercentage;
            this.patBottlePercentage = view.patBottlePercentage;
            this.branchMachineNumber=view.branchMachineNumber;
            this.barcodeTemplateView=view.barcodeTemplateView;
            this.isSelect=view.isSelect;
            this.startDate=view.startDate;
            this.endDate=view.endDate;
            this.date=view.date;
            this.machineType=view.machineType;
            this.plasticBinResetDate=view.plasticBinResetDate;
            this.glassBinResetDate=view.glassBinResetDate;
            this.aluminiumnBinResetDate=view.aluminiumnBinResetDate;
            this.machineViews=view.machineViews;
            this.patBottleCount=view.patBottleCount;
            this.glassBottleCount=view.glassBottleCount;
            this.aluBottleCount=view.aluBottleCount;
            this.password=view.password;
            this.lastHardResetDate=view.lastHardResetDate;
            this.glassResetCount=view.glassResetCount;
            this.plasticResetCount=view.plasticResetCount;
            this.aluminiumnResetCount=view.aluminiumnResetCount;
            this.totalBottleCount=view.totalBottleCount;
            this.totalVoucher=view.totalVoucher;
            this.hoursFromPickup=view.hoursFromPickup;
            this.pickupEveryday = view.pickupEveryday;
            this.totalWight=view.totalWight;
            this.materialWeight=view.materialWeight;
            this.binWeight=view.binWeight;
            this.noGlassBinPickup=view.noGlassBinPickup;
            this.machineBarcodeFileView = view.machineBarcodeFileView;
            this.acceptedMaterials = view.acceptedMaterials
        }
    }
}