import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzAvatarModule } from '@nz/avatar';
import { tap } from 'rxjs';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from '../../../../services/player.service';

@Component({
    imports: [NzAvatarModule],
    templateUrl: './player-details.page.html',
    styleUrl: './player-details.page.css'
})
export class PlayerDetailsPageComponent {
  protected player: Player | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: PlayerService,
  ) {}

  ngOnInit() {
    const playerId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!playerId) {
      this.router.navigateByUrl('/admin/players');
    }

    this.svc
      .getPlayer(playerId)
      .pipe(
        tap((p) => {
          this.player = p;
        }),
      )
      .subscribe();
  }
}
