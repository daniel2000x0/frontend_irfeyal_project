import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a default admin user', () => {
    const user = service.usuario();
    expect(user.id_usuario).toBe(1);
    expect(user.empleado?.id_empleado).toBe(1);
    expect(user.roles).toContain('ROLE_Administrador');
  });
});
