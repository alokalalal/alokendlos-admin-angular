import { KeyValueView } from '../view/common/key-value-view';
import { AcceessRightsInterface } from './acceess-rights';

export type ListContainer = {
    pageTitle: string;
    accessRightsJson: AcceessRightsInterface
    hasDisplayStyleButtons: boolean,
    defaultDisplayStyle: 'list' | 'card'
    advanceSearchFilterConfig?: Map<string, AdvanceSearchFilterConfig>
    listOrderConfig?: ListOrderConfig,
    hasDisplayStylePagination: boolean,
    hasDisplayExportButton: boolean,
}
export class AdvanceSearchFilterConfig {
    lable: string = "";
    placeHolder: string = "";
    type: 'text' | 'select' | 'multi-select' | 'fullTextSearch' | 'date-range' = 'text';
    options?: KeyValueView[];
    value: KeyValueView | KeyValueView[] | string = "";
    appliedValue: KeyValueView | KeyValueView[] | string = "";
    searchByLable: string = "";
    isApplied: boolean = false;
}
interface ListOrderConfig {
    parameterList: KeyValueView[];
    defaultSelectedParameter: KeyValueView
    defaultSelectedOrderType: KeyValueView
}
