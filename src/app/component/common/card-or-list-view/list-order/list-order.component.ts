import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { OrderTypeEnum } from '../enum/order-type-enum';

@Component({
    selector: 'app-list-order[orderParams][selectedOederType][selectedOrderParam]',
    templateUrl: './list-order.component.html',
    styleUrls: ['./list-order.component.scss']
})

export class ListOrderComponent {
    public orderTypeEnum = OrderTypeEnum;
    @Input() selectedOederType: KeyValueView = OrderTypeEnum.DESC;
    @Input() selectedOrderParam!: KeyValueView | undefined;
    @Input() orderParams: Array<KeyValueView> | undefined;
    @Output() selectedOrderParamEmitter: EventEmitter<KeyValueView> = new EventEmitter();
    @Output() selectedOrderTypeEmitter: EventEmitter<KeyValueView> = new EventEmitter();

    changeAscDes(value: KeyValueView) {
        this.selectedOederType = value;
        this.selectedOrderTypeEmitter.emit(this.selectedOederType);
    }
}
