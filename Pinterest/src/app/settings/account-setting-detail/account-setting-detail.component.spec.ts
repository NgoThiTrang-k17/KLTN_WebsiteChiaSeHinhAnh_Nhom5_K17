import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingDetailComponent } from './account-setting-detail.component';

describe('AccountSettingDetailComponent', () => {
  let component: AccountSettingDetailComponent;
  let fixture: ComponentFixture<AccountSettingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSettingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
