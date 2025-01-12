import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturesPageComponent } from './fixtures.page';

describe(FixturesPageComponent.name, () => {
  let component: FixturesPageComponent;
  let fixture: ComponentFixture<FixturesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixturesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FixturesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
