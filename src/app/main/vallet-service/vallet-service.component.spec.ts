import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValletServiceComponent } from './vallet-service.component';

describe('ValletServiceComponent', () => {
  let component: ValletServiceComponent;
  let fixture: ComponentFixture<ValletServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValletServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValletServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
