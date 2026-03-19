import { KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './keycloak.init';
import { environment } from '../../../environments/environment';

describe('initializeKeycloak', () => {
  let keycloakSpy: jasmine.SpyObj<KeycloakService>;

  beforeEach(() => {
    keycloakSpy = jasmine.createSpyObj('KeycloakService', ['init']);
    keycloakSpy.init.and.returnValue(Promise.resolve(true));
  });

  it('should return a factory function', () => {
    const factory = initializeKeycloak(keycloakSpy);
    expect(typeof factory).toBe('function');
  });

  it('should call keycloak.init with correct config', async () => {
    // GIVEN
    const factory = initializeKeycloak(keycloakSpy);

    // WHEN
    await factory();

    // THEN
    expect(keycloakSpy.init).toHaveBeenCalledWith(jasmine.objectContaining({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: jasmine.objectContaining({
        onLoad: 'check-sso',
        checkLoginIframe: false,
      }),
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/api/products', '/api/categories'],
    }));
  });

  it('should return the keycloak init promise result', async () => {
    // GIVEN
    keycloakSpy.init.and.returnValue(Promise.resolve(true));
    const factory = initializeKeycloak(keycloakSpy);

    // WHEN
    const result = await factory();

    // THEN
    expect(result).toBeTrue();
  });

  it('should propagate init failure', async () => {
    // GIVEN
    keycloakSpy.init.and.returnValue(Promise.reject(new Error('init failed')));
    const factory = initializeKeycloak(keycloakSpy);

    // WHEN / THEN
    await expectAsync(factory()).toBeRejectedWithError('init failed');
  });
});
