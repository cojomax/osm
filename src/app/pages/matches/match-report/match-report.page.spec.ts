import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchReportPage } from './match-report.page';

describe('MatchReportComponent', () => {
  let component: MatchReportPage;
  let fixture: ComponentFixture<MatchReportPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchReportPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
