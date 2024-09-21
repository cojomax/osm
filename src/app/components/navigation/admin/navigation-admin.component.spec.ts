import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationAdminComponent } from './navigation-admin.component';

describe('AdminNavComponent', () => {
  let component: NavigationAdminComponent;
  let fixture: ComponentFixture<NavigationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
