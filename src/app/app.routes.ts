import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomePageComponent } from './pages/home/home.page';
import { MatchReportPageComponent } from './pages/match-report/match-report.page';
import { PageNotFoundPageComponent } from './pages/not-found/not-found.page';
import { RegisterPageComponent } from './pages/register/register.page';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'match-report', component: MatchReportPageComponent },
    { path: '**', component: PageNotFoundPageComponent }
];
