import { Routes } from '@angular/router';
import { PlayerDetailsPageComponent } from './pages/admin/players/details/player-details.page';
import { PlayersPageComponent } from './pages/admin/players/players.page';
import { HomePageComponent } from './pages/home/home.page';
import { LoginPageComponent } from './pages/login/login.page';
import { PageNotFoundPageComponent } from './pages/not-found/not-found.page';
import { TeamPageComponent } from './pages/team/team.page';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  // { path: 'register', component: RegisterPageComponent },
  // { path: 'match-report', component: MatchReportPageComponent },
  { path: 'team', component: TeamPageComponent },
  {
    path: 'admin',
    
    children: [
      { path: 'players/:id', component: PlayerDetailsPageComponent },
      { path: 'players', component: PlayersPageComponent },
    ],
  },
  { path: '**', component: PageNotFoundPageComponent },
];
