import { IdentifierView } from '../view/common/identifier-view';
import { CustomerView } from './customer-view';
import { LocationView } from './location-view';
import { MachineView } from './machine-view';
import { TransactionLog } from './transaction-log';

export class TransactionView extends IdentifierView {
    transactionId: string;
    machineView: MachineView;
    aluBottleCount: number;
    aluBottleValue: number;
    barcode: string;
    dateEnd: number;
    dateStart: number;
    dateUpdate: number;
    glassBottleCount: number;
    glassBottleValue?: number;
    patBottleCount: number;
    totalInsertedBottleCount?: number;
    totalValue: number;
    transactionLogViews?: TransactionLog
    offline:boolean;
    public customerView?: CustomerView;
    public locationView?: LocationView;
    startDate: number;
    endDate: number;
    volumn: number;
    machineViews: MachineView;
    weight: number;

    constructor(transaction?: TransactionView) {
        super(transaction)
        if (transaction != undefined) {
            this.transactionId = transaction.transactionId;
            this.machineView = transaction.machineView;
            this.aluBottleCount = transaction.aluBottleCount;
            this.aluBottleValue = transaction.aluBottleValue;
            this.barcode = transaction.barcode;
            this.dateEnd = transaction.dateEnd;
            this.dateStart = transaction.dateStart;
            this.dateUpdate = transaction.dateUpdate;
            this.glassBottleCount = transaction.glassBottleCount;
            this.patBottleCount = transaction.patBottleCount;
            this.totalValue = transaction.totalValue;
            this.offline = transaction.offline;
            this.customerView = transaction.customerView;
            this.locationView = transaction.locationView;
            this.startDate = transaction.startDate;
            this.endDate = transaction.endDate;
            this.volumn = transaction.volumn;
            this.machineViews = transaction.machineViews;
            this.weight = transaction.weight;
        }
    }
}