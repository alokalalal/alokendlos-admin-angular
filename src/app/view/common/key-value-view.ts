import { View } from "./view";

export class KeyValueView implements View {
  key: number | string;
  value?: string;
  constructor(view: KeyValueView) {
    this.key = view.key
    this.value = view.value;
  }
}