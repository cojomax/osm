import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  get routes() {
    return {
      home: 'home',
      login: 'login',
      register: 'register',
      matchReport: 'match-report',
      admin: 'admin',
      players: 'admin/players',
      playerDetails: 'admin/players/:id',
      team: 'team',
      fallback: '**',
    };
  }
}
