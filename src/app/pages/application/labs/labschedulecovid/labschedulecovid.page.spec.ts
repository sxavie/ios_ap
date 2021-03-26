import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LabschedulecovidPage } from './labschedulecovid.page';

describe('LabschedulecovidPage', () => {
  let component: LabschedulecovidPage;
  let fixture: ComponentFixture<LabschedulecovidPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabschedulecovidPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LabschedulecovidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
