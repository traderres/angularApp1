import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongReportComponent } from './long-report.component';

describe('LongReportComponent', () => {
  let component: LongReportComponent;
  let fixture: ComponentFixture<LongReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LongReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
