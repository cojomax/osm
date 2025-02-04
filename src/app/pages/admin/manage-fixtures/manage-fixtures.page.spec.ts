import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFixturesPageComponent } from './manage-fixtures.page';

describe(ManageFixturesPageComponent.name, () => {
  let component: ManageFixturesPageComponent;
  let fixture: ComponentFixture<ManageFixturesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFixturesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageFixturesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
