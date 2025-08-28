import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProductComponent } from './deleteproduct.component';

describe('DeleteproductComponent', () => {
  let component: DeleteProductComponent;
  let fixture: ComponentFixture<DeleteProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
