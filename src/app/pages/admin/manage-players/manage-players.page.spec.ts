import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePlayersPageComponent } from './manage-players.page';

describe('PlayersComponent', () => {
  let component: ManagePlayersPageComponent;
  let fixture: ComponentFixture<ManagePlayersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePlayersPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePlayersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
