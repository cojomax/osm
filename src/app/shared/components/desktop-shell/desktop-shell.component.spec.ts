import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopShellComponent } from './desktop-shell.component';

describe('DesktopShellComponent', () => {
  let component: DesktopShellComponent;
  let fixture: ComponentFixture<DesktopShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
