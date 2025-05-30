import { Routes } from '@angular/router';
import { PlayerDetailsPageComponent } from './pages/admin/players/details/player-details.page';
import { PlayersPageComponent } from './pages/admin/players/players.page';
import { HomePageComponent } from './pages/home/home.page';
import { LoginPageComponent } from './pages/login/login.page';
import { PageNotFoundPageComponent } from './pages/not-found/not-found.page';
import { TeamPageComponent } from './pages/team/team.page';
import { ManageFixturesPageComponent } from './pages/admin/manage-fixtures/manage-fixtures.page';
import { FixturesPageComponent } from './pages/fixtures/fixtures.page';
import { MatchReportPage } from './pages/match-report/match-report.page';
import { canAccessAdmin } from './shared/guards/can-access-admin.guard';
import { StatsLoaderComponent } from './pages/stats/stats-loader.component';
import { mobileResolver } from './services/mobile.resolver';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent, title: 'Login' },
  { path: 'team', component: TeamPageComponent, title: 'Team', data: { header: 'Team' } },
  { path: 'fixtures', component: FixturesPageComponent, title: 'Fixtures', data: { header: 'Fixtures' } },
  { path: 'results/:id', component: MatchReportPage, title: 'Match Report' },
  { path: 'results', component: FixturesPageComponent, title: 'Results', data: { header: 'Results' } },
  {
    path: 'stats',
    component: StatsLoaderComponent,
    resolve: { mobile: mobileResolver },
    title: 'Stats',
    data: { header: 'Stats' },
  },
  {
    path: 'admin',
    title: 'Admin',
    canMatch: [canAccessAdmin],
    children: [
      { path: 'players/:id', component: PlayerDetailsPageComponent },
      { path: 'players', component: PlayersPageComponent },
      { path: 'fixtures', component: ManageFixturesPageComponent },
    ],
  },
  { path: '**', component: PageNotFoundPageComponent },
];
