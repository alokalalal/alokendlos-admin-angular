import { EntityStore, getEntityType, getIDType } from "@datorama/akita";
import { View } from "src/app/view/common/view";
import { AkitaState } from "./akita-state";

export abstract class AkitaEntityStoreService<view extends View, state extends AkitaState<view>> extends EntityStore<state>  {

    constructor(initialState: Partial<state>) {
        super(initialState);
    }

    addEntity(entity: getEntityType<state>) {
        this.add(entity);
    }

    updateEntity(id: getIDType<state>, entity: getEntityType<state>) {
        this.update(id, entity);
    }

    addOrUpdateEntity(id: getIDType<state>, entity: getEntityType<state>): void {
        this.upsert(id, entity)
    }

}