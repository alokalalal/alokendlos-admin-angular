import { EntityState } from "@datorama/akita";

export interface FilterDataEntity extends EntityState<FilterDataEntity, string> {
    id: string;
}