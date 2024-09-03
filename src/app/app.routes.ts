import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { LoginPageComponent } from './pages/login/login.page';
import { MatchReportPageComponent } from './pages/match-report/match-report.page';
import { PageNotFoundPageComponent } from './pages/not-found/not-found.page';
import { RegisterPageComponent } from './pages/register/register.page';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'match-report', component: MatchReportPageComponent },
    { path: '**', component: PageNotFoundPageComponent }
];
