import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private platformId = inject(PLATFORM_ID);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.tokenSubject.pipe(map((token) => !!token));

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredAuth();
  }

  private loadStoredAuth() {
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this.tokenSubject.next(storedToken);
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const formData = new FormData();
    formData.append('username', email); // OAuth2 expects 'username' field
    formData.append('password', password);

    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, formData, {
        headers,
      })
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        tap(() => this.router.navigate(['/']))
      );
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
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        tap(() => this.router.navigate(['/']))
      );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private handleAuthResponse(response: AuthResponse) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', response.access_token);
    }
    this.tokenSubject.next(response.access_token);
  }

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }
}
