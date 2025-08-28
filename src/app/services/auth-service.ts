import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private get canUseStorage(): boolean {
    return (
      isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined'
    );
  }

  isLoggedIn(): boolean {
    if (!this.canUseStorage) return false;
    return !!localStorage.getItem('token');
  }

  logout(): void {
    if (!this.canUseStorage) return;
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ensure user profile cleared
  }

  isAdmin(): boolean {
    if (!this.canUseStorage) return false;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  }
}
