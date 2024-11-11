import { View } from "./view";

export class IdNameView implements View {
  id: number | string;
  name?: string;
  constructor(view: IdNameView) {
    this.id = view.id
    this.name = view.name;
  }
}