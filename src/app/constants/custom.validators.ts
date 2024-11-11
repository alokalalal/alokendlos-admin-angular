import { AbstractControl } from '@angular/forms';
import { Pattern } from './pattern';

export function loginIdValidation(control: AbstractControl) {
    var isEmail = Pattern.email.test(control.value);
    if (isEmail) {
        return null;
    }
    var isMobile = Pattern.mobile.test(control.value);
    if (isMobile && control.value != undefined && control.value.length == 10) {
        return null;
    }
    return { 'pattern': true };
}
export function isJson(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}