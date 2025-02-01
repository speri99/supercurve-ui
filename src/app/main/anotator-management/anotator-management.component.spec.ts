import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotatorManagementComponent } from './anotator-management.component';

describe('AnotatorManagementComponent', () => {
  let component: AnotatorManagementComponent;
  let fixture: ComponentFixture<AnotatorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnotatorManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotatorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
