export class KeyValue {
    key: number | string;
    value?: string;
    constructor(keyValue: KeyValue) {
      this.key = keyValue.key
      this.value = keyValue.value;
    }
  }

export const KeyValueTemplate = {
  'key': '',
  'value': ''
}