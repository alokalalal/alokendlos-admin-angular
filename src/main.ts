import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableAkitaProdMode, persistState } from '@datorama/akita';
import { AppModule } from './app/app.module';
import { AkitaStoreKey } from './app/constants/akita-store-key';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

export const authUserPersistStorage = persistState({
  include: [
    AkitaStoreKey.AUTH_USER,
  ],
  key: 'ENDLOS_' + AkitaStoreKey.AUTH_USER
});

export const currentUserPersistStorage = persistState({
  include: [
    AkitaStoreKey.CURRENT_USER,
  ],
  key: 'ENDLOS_' + AkitaStoreKey.CURRENT_USER
});


const providers = [
  { provide: 'authUserPersistStorage', useValue: authUserPersistStorage },
  { provide: 'currentUserPersistStorage', useValue: currentUserPersistStorage }
];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
