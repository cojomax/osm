import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzAvatarModule } from '@nz/avatar';
import { tap } from 'rxjs';
import { Player } from 'src/app/domain/player/player.model';
import { PlayerService } from 'src/app/domain/player/player.service';

@Component({
  standalone: true,
  imports: [NzAvatarModule],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.css',
})
export class PlayerDetailsPageComponent {
  protected player: Player | null = null;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _svc: PlayerService,
  ) {}

  ngOnInit() {
    const playerId = this._route.snapshot.paramMap.get('id') ?? '';

    if (!playerId) {
      this._router.navigateByUrl('/admin/players');
    }

    this._svc
      .getPlayer(playerId)
      .pipe(
        tap((p) => {
          this.player = p;
        }),
      )
      .subscribe();
  }
}
