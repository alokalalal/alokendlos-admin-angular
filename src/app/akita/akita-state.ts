import { View } from "src/app/view/common/view";
import { AkitaEntityStateInterface } from "../Interface/akita-entity-state";

export interface AkitaState<view extends View> extends AkitaEntityStateInterface<view> { }
