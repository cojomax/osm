import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withViewTransitions } from '@angular/router';
import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { ngZorroConfig } from 'src/theme/ng-zorro.config';
import { environment } from '../environments/environment';
import { ROUTES } from './app.routes';
import { IS_MOBILE, isMobileFactory } from './services/tokens/is-mobile.token';
import { SESSION, sessionFactory } from './services/tokens/session.token';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    // Angular
    provideRouter(ROUTES, withViewTransitions()),
    provideAnimationsAsync(),
    importProvidersFrom(FormsModule),
    provideHttpClient(),
    [{ provide: LOCALE_ID, useValue: 'en-US' }],

    // NG Zorro
    provideNzI18n(en_US),
    { provide: NZ_CONFIG, useValue: ngZorroConfig },

    // Custom
    { provide: SESSION, useFactory: sessionFactory },
    { provide: IS_MOBILE, useFactory: isMobileFactory },
  ],
};
