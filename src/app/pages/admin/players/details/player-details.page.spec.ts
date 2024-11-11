import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDetailsPageComponent } from './player-details.page';

describe('PlayerDetailsComponent', () => {
  let component: PlayerDetailsPageComponent;
  let fixture: ComponentFixture<PlayerDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
