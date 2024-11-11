import { IdentifierView } from '../view/common/identifier-view';
import { FileView } from './file-view';
import { MachineView } from './machine-view';

export class BarcodeMachineItemView extends IdentifierView {
    

    public barcodeName: string;
    public materialType: Number;
    //public material: string;
    public itemVolume: Number;
    public itemWeight: Number;
    public itemValue?: Number;
    

    constructor(barcodeMachineItemView?: BarcodeMachineItemView) {
        super(barcodeMachineItemView)
        if (barcodeMachineItemView != undefined) {
        this.barcodeName = barcodeMachineItemView.barcodeName;
        this.materialType = barcodeMachineItemView.materialType;
        //this.material = barcodeMachineItemView.material;
        this.itemVolume = barcodeMachineItemView.itemVolume;
        this.itemWeight = barcodeMachineItemView.itemWeight;
        this.itemValue = barcodeMachineItemView.itemValue;
        }
    }
}