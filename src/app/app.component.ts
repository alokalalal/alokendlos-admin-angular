import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationStart, NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeTypeEnum, ThemeColorEnum } from './constants/theme-type.enum';
import { ThemeService } from './services/app-theme.service';



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.Default,
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'endlos-admin-angular';
	public isNavigationEnd: boolean = true
	public darkThemeEnabled = false;
	themeColor: any;
	public destroy$: Subject<boolean> = new Subject<boolean>();

	ngOnInit() {
		this.themeService.getTheme().pipe(takeUntil(this.destroy$)).subscribe((data) => {
			if (data === ThemeTypeEnum.light) {
				this.darkThemeEnabled = false;
			}
			else {
				this.darkThemeEnabled = true;
			}
		});
		this.themeService.getThemeColor().pipe(takeUntil(this.destroy$)).subscribe((data) => {
			this.themeColor = data;
		});
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.isNavigationEnd = false;
			}
			if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
				// this.layout = event.data.layout;
				this.isNavigationEnd = true;
			}
			// ActivationStart 
			if (event instanceof ActivationStart) {

			}
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	constructor(
		private router: Router,
		private themeService: ThemeService) {
	}
}
