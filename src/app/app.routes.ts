import { Routes } from '@angular/router';
import { PlayerDetailsPageComponent } from './pages/admin/players/details/player-details.component';
import { PlayersPageComponent } from './pages/admin/players/players.component';
import { HomePageComponent } from './pages/home/home.page';
import { LoginPageComponent } from './pages/login/login.page';
import { MatchReportPageComponent } from './pages/match-report/match-report.page';
import { PageNotFoundPageComponent } from './pages/not-found/not-found.page';
import { RegisterPageComponent } from './pages/register/register.page';
import { TeamPageComponent } from './pages/team/team.page';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'match-report', component: MatchReportPageComponent },
  {
    path: 'admin',
    children: [
      { path: 'players/:id', component: PlayerDetailsPageComponent },
      { path: 'players', component: PlayersPageComponent },
    ],
  },
  { path: 'team', component: TeamPageComponent },
  { path: '**', component: PageNotFoundPageComponent },
];
