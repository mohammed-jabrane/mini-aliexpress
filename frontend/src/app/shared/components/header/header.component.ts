import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  searchQuery = '';
  cartCount = 0;
  isLoggedIn = false;
  username = '';

  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
  ) {
    this.initAuth();
  }

  private async initAuth(): Promise<void> {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    if (this.isLoggedIn) {
      const profile = await this.keycloakService.loadUserProfile();
      this.username = profile.username || profile.email || 'User';
    }
  }

  onSearch(): void {
    const query = this.searchQuery.trim();
    this.router.navigate(['/products'], {
      queryParams: query ? { q: query } : {},
    });
  }

  login(): void {
    this.keycloakService.login();
  }

  logout(): void {
    this.keycloakService.logout();
  }
}
