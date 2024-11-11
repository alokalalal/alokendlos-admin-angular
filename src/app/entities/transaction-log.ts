import { FileView } from '../view/common/file-view';
import { IdentifierView } from '../view/common/identifier-view';
import { KeyValue } from './key-value';

export class TransactionLog extends IdentifierView {
    reason: string;
    barcode: string;
    status: KeyValue;
    imageView : FileView;

    constructor(transactionLog: TransactionLog) {
        super(transactionLog)
        this.reason = transactionLog.reason;
        this.barcode = transactionLog.barcode;
        this.status = transactionLog.status;
        this.imageView=transactionLog.imageView;
    }
}