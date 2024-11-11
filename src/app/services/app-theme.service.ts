import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { ThemeTypeEnum } from "../constants/theme-type.enum";
import { ThemeColorEnum } from './../constants/theme-type.enum';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	currentThemeTypeEnum: ThemeTypeEnum = ThemeTypeEnum.light;
	currentThemeTypeSubject = new Subject<string>();

	currentThemeColorEnum: ThemeColorEnum = ThemeColorEnum.blue;
	currentThemeColorSubject = new Subject<string>();

	constructor() {}

	toggleTheme(): void {
		if (this.currentThemeTypeEnum === ThemeTypeEnum.light) {
			this.currentThemeTypeEnum = ThemeTypeEnum.dark;
			this.currentThemeTypeSubject.next(ThemeTypeEnum.dark);
		} else {
			this.currentThemeTypeEnum = ThemeTypeEnum.light;
			this.currentThemeTypeSubject.next(ThemeTypeEnum.light);
		}
	}

	getTheme(): Observable<string> {
		return this.currentThemeTypeSubject.asObservable();
	}

	changeThemeColor(themeColorEnum: ThemeColorEnum) {
		this.currentThemeColorSubject.next(themeColorEnum);
	}

	getThemeColor(): Observable<string> {
		return this.currentThemeColorSubject.asObservable();
	}
}