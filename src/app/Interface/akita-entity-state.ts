import { HashMap } from "@datorama/akita";

export interface AkitaEntityStateInterface<T> {
  entities: HashMap<T>;
  ids: number[];
  error: any;
}