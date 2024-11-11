import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyPickupAssigneeListComponent } from './daily-pickup-assignee-list.component';

describe('DailyPickupAssigneeListComponent', () => {
  let component: DailyPickupAssigneeListComponent;
  let fixture: ComponentFixture<DailyPickupAssigneeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyPickupAssigneeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPickupAssigneeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
