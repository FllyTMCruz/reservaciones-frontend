import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Espacios } from './espacios';

describe('Espacios', () => {
  let component: Espacios;
  let fixture: ComponentFixture<Espacios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Espacios],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Espacios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
