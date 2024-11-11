export class KeyValueDisplayValue {
    key: number;
    value: string;
    displayValue?: string;
    constructor(keyValueDisplayValue: KeyValueDisplayValue) {
      this.key = keyValueDisplayValue.key
      this.value = keyValueDisplayValue.value;
      this.displayValue = keyValueDisplayValue.displayValue;
    }
  }