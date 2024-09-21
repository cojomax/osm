import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMainComponent } from './navigation-main.component';

describe('NavigationComponent', () => {
  let component: NavigationMainComponent;
  let fixture: ComponentFixture<NavigationMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
