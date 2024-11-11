import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import en from '@angular/common/locales/en';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { ngZorroConfig } from 'src/theme/ng-zorro.config';
import { routes } from './app.routes';
import { FIREBASE, firebaseFactory } from './services/tokens/firebase-config.token';
import { SESSION, sessionFactory } from './services/tokens/session.token';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(FormsModule),
    provideHttpClient(),
    [{provide: LOCALE_ID, useValue: 'en-US' }],
    // Library Providers
    provideNzI18n(en_US),
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    // Custom Providers
    { provide: SESSION, useFactory: sessionFactory },
    { provide: FIREBASE, useFactory: firebaseFactory },
  ],
};
