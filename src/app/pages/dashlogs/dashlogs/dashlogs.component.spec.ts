import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashlogsComponent } from './dashlogs.component';

describe('DashlogsComponent', () => {
  let component: DashlogsComponent;
  let fixture: ComponentFixture<DashlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashlogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
