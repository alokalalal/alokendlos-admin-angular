import { IdentifierView } from '../view/common/identifier-view';
import { MachineView } from './machine-view';

export class MachineCapacityView extends IdentifierView {

    plasticCapacity:number;
    glassCapacity:number;
    aluminiumnCapacity:number;
    printCapacity:number;
    maxTransaction:number;
    maxAutoCleaning:number;
    createDate: number;
    machineView: MachineView;

    constructor(machineCapacityView?: MachineCapacityView) {
        super(machineCapacityView)
        if(machineCapacityView != undefined){
        this.glassCapacity = machineCapacityView.glassCapacity;
        this.plasticCapacity = machineCapacityView.plasticCapacity;
        this.aluminiumnCapacity = machineCapacityView.aluminiumnCapacity;
        this.createDate = machineCapacityView.createDate;
        this.machineView = machineCapacityView.machineView;
        this.printCapacity = machineCapacityView.printCapacity;
        this.maxTransaction = machineCapacityView.maxTransaction;
        this.maxAutoCleaning = machineCapacityView.maxAutoCleaning;
        }
    }
}