import { IdName } from "./id-name";
import { KeyValue } from "./key-value";

export class MachineErrorType {
    id?: number;
    coilErrorValue: boolean;
    errorName: string;
    type: KeyValue;
    address: number;
    regErrorValue: string;
    applicableMachineViews: IdName[];

    constructor(machineErrorType: MachineErrorType) {
        this.id = machineErrorType.id;
        this.coilErrorValue = machineErrorType.coilErrorValue;
        this.type = machineErrorType.type;
        this.address = machineErrorType.address;
        this.errorName = machineErrorType.errorName;
        this.regErrorValue = machineErrorType.regErrorValue;
        this.applicableMachineViews = machineErrorType.applicableMachineViews;
    }
}

export const MachineErrorTypeTemplate = {
    errorName: '',
    'type': { key: '', value: '' },
    'applicableMachineViews': []
}