import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticCurrentFullnesLogComponentComponent } from './logistic-current-fullnes-log-component.component';

describe('LogisticCurrentFullnesLogComponentComponent', () => {
  let component: LogisticCurrentFullnesLogComponentComponent;
  let fixture: ComponentFixture<LogisticCurrentFullnesLogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogisticCurrentFullnesLogComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticCurrentFullnesLogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
