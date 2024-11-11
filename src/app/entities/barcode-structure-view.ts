import { TransactionView } from 'src/app/entities/transaction-view';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { ArchiveView } from "../view/common/archive-view";
import { BarcodeTemplateView } from './barcode-template-view';
import { CustomerView } from "./customer-view";
import { LocationView } from './location-view';

export class BarcodeStructureView extends ArchiveView {
    fieldName?: string;
    value?: string;
    endValue?: string;
    length?: string;
    barcodeType?: KeyValueView;
    dynamicValue?: KeyValueView;
    barcodeTemplateView?: BarcodeTemplateView;
    index?: any;
    constructor(view?: BarcodeStructureView) {
        super(view)
        if (view != undefined) {
            this.fieldName = view.fieldName;
            this.value = view.value;
            this.length = view.length;
            this.barcodeType = view.barcodeType;
            this.dynamicValue = view.dynamicValue;
            this.barcodeTemplateView = view.barcodeTemplateView;
            this.index = view.index;
            this.endValue = view.endValue;
        }
    }
}