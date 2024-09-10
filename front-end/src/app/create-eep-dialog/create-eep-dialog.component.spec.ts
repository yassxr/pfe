import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEepDialogComponent } from './create-eep-dialog.component';

describe('CreateEepDialogComponent', () => {
  let component: CreateEepDialogComponent;
  let fixture: ComponentFixture<CreateEepDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEepDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEepDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
