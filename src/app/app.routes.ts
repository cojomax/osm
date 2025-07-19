import { Routes } from '@angular/router';
import { ManagePlayersPageComponent } from './pages/admin/manage-players/manage-players.page';
import { HomePageComponent } from './pages/home/home.page';
import { LoginPageComponent } from './pages/login/login.page';
import { PageNotFoundPageComponent } from './pages/not-found/not-found.page';
import { TeamPageComponent } from './pages/team/team.page';
import { ManageFixturesPageComponent } from './pages/admin/manage-fixtures/manage-fixtures.page';
import { FixturesPageComponent } from './pages/fixtures/fixtures.page';
import { MatchReportPage } from './pages/match-report/match-report.page';
import { StatsLoaderComponent } from './pages/stats/stats-loader.component';
import { mobileResolver } from './services/mobile.resolver';
import { StatsMDetailsPageComponent } from './pages/stats/m/details/stats-details.m.page';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

export const ROUTES: Routes = [
  { path: 'login', component: LoginPageComponent, title: 'Login' },
  {
    path: '',
    resolve: { mobile: mobileResolver },
    loadComponent: () => import('./shared/components/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', component: HomePageComponent },
      { path: 'team', component: TeamPageComponent, title: 'Team', data: { header: 'Team' } },
      { path: 'fixtures', component: FixturesPageComponent, title: 'Fixtures', data: { header: 'Fixtures' } },
      { path: 'results/:id', component: MatchReportPage, title: 'Match Report' },
      { path: 'results', component: FixturesPageComponent, title: 'Results', data: { header: 'Results' } },
      {
        path: 'stats',
        title: 'Stats',
        resolve: { mobile: mobileResolver },
        data: { header: 'Stats' },
        // FIXME May also have to be a loader at child level?
        children: [
          { path: ':category', component: StatsMDetailsPageComponent },
          { path: '', component: StatsLoaderComponent },
        ],
      },
    ],
  },
  {
    path: 'admin',
    title: 'Admin',
    loadComponent: () => import('./components/admin/shell/admin-shell.component').then((m) => m.AdminShellComponent),
    // see https://github.com/angular/angularfire/blob/main/site/src/auth/route-guards.md
    canActivate: [AuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['/login']) },
    children: [
      { path: 'players', component: ManagePlayersPageComponent },
      { path: 'fixtures', component: ManageFixturesPageComponent },
    ],
  },
  { path: '**', component: PageNotFoundPageComponent },
];
