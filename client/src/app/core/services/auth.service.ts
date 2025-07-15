import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private platformId = inject(PLATFORM_ID);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  private loadStoredAuth() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        this.currentUserSubject.next(JSON.parse(storedUser));
        this.tokenSubject.next(storedToken);
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(tap((response) => this.handleAuthResponse(response)));
  }

  register(
    email: string,
    password: string,
    name: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, {
        email,
        password,
        name,
      })
      .pipe(tap((response) => this.handleAuthResponse(response)));
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  private handleAuthResponse(response: AuthResponse) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    }
    this.currentUserSubject.next(response.user);
    this.tokenSubject.next(response.token);
  }

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }
}
