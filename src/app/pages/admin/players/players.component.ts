import { Component } from '@angular/core';
import { PlayerFormComponent } from "../../../components/forms/player/player.form";

@Component({
  standalone: true,
  imports: [PlayerFormComponent],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css'
})
export class PlayersPageComponent {

}
