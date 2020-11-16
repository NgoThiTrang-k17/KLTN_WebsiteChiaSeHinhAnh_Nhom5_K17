import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardColumnsImageComponent } from './card-columns-image.component';

describe('CardColumnsImageComponent', () => {
  let component: CardColumnsImageComponent;
  let fixture: ComponentFixture<CardColumnsImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardColumnsImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardColumnsImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
