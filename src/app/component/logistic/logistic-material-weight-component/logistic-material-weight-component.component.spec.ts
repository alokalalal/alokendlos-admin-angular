import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticMaterialWeightComponentComponent } from './logistic-material-weight-component.component';

describe('LogisticMaterialWeightComponentComponent', () => {
  let component: LogisticMaterialWeightComponentComponent;
  let fixture: ComponentFixture<LogisticMaterialWeightComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogisticMaterialWeightComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticMaterialWeightComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
