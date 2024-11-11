import { KeyValueDisplayValue } from "./key-value-display-value";

export class Settings{
    defaultFilePath: string;
    captchaImagePath: string;
    defaultTimeZone: KeyValueDisplayValue;
    constructor(settings: Settings){
        this.defaultFilePath = settings.defaultFilePath;
        this.captchaImagePath = settings.captchaImagePath;
        this.defaultTimeZone = settings.defaultTimeZone;
    }
}

export const SettingTemplate = {
    'defaultFilePath': '',
    'captchaImagePath': '',
    'defaultTimeZone': {key: Number(),value: "", displayValue: ""}
}
