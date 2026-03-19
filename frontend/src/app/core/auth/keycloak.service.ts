import { Injectable, signal } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthKeycloakService {
  readonly isAuthenticated = signal(false);
  readonly currentUsername = signal('');
  readonly currentRoles = signal<string[]>([]);

  constructor(private keycloakService: KeycloakService) {
    const loggedIn = this.keycloakService.isLoggedIn();
    this.isAuthenticated.set(loggedIn);
    if (loggedIn) {
      this.currentRoles.set(this.keycloakService.getUserRoles());
      const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed;
      this.currentUsername.set(
        tokenParsed?.['preferred_username'] || tokenParsed?.['email'] || '',
      );
    }
  }

  isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  getUsername(): string {
    return this.currentUsername();
  }

  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  hasRole(role: string): boolean {
    return this.keycloakService.isUserInRole(role);
  }

  login(): Promise<void> {
    return this.keycloakService.login();
  }

  logout(): Promise<void> {
    return this.keycloakService.logout();
  }

  getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }

  loadUserProfile(): Promise<KeycloakProfile> {
    return this.keycloakService.loadUserProfile();
  }
}
