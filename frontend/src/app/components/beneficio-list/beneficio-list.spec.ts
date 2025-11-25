import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficioList } from './beneficio-list';

describe('BeneficioList', () => {
  let component: BeneficioList;
  let fixture: ComponentFixture<BeneficioList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficioList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficioList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
