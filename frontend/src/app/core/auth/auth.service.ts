import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, AuthUser, LoginRequest } from './auth.models';

const TOKEN_KEY = 'lpul_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly base = environment.apiUrl;

  readonly token = signal<string | null>(this.readToken());
  readonly user = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => this.token() !== null);

  login(payload: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${this.base}/auth/login`, payload)
      .pipe(tap((res) => res.success && this.setSession(res)));
  }

  /** Validate the stored token and refresh the current user. */
  me() {
    return this.http
      .get<AuthResponse>(`${this.base}/auth/me`)
      .pipe(tap((res) => this.user.set(toUser(res))));
  }

  logout() {
    this.token.set(null);
    this.user.set(null);
    if (this.isBrowser) localStorage.removeItem(TOKEN_KEY);
  }

  private setSession(res: AuthResponse) {
    this.token.set(res.token);
    this.user.set(toUser(res));
    if (this.isBrowser) localStorage.setItem(TOKEN_KEY, res.token);
  }

  private readToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
  }
}

function toUser(res: AuthResponse): AuthUser {
  return {
    username: res.username,
    role: res.role,
    email: res.email,
    fullname: res.fullname,
    empId: res.empId,
  };
}
