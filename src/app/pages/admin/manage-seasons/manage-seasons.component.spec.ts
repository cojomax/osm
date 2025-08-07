import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSeasonsComponent } from './manage-seasons.component';

describe('ManageSeasonsComponent', () => {
  let component: ManageSeasonsComponent;
  let fixture: ComponentFixture<ManageSeasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSeasonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSeasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
