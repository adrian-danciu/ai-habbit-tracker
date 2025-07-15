import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Habit {
  id: number;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HabitResponse {
  id: number;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitDto {
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

interface CreateHabitRequest {
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface UpdateHabitDto extends Partial<CreateHabitDto> {}

interface UpdateHabitRequest extends Partial<CreateHabitRequest> {}

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private apiUrl = `${environment.apiUrl}/habits`;

  constructor(private http: HttpClient) {}

  private mapResponseToHabit(response: HabitResponse): Habit {
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      frequency: response.frequency,
      startDate: response.start_date,
      endDate: response.end_date,
      isActive: response.is_active,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
    };
  }

  private mapCreateDtoToRequest(dto: CreateHabitDto): CreateHabitRequest {
    return {
      name: dto.name,
      description: dto.description,
      frequency: dto.frequency,
      start_date: dto.startDate,
      end_date: dto.endDate,
      is_active: dto.isActive,
    };
  }

  private mapUpdateDtoToRequest(dto: UpdateHabitDto): UpdateHabitRequest {
    const request: UpdateHabitRequest = {};
    if (dto.name !== undefined) request.name = dto.name;
    if (dto.description !== undefined) request.description = dto.description;
    if (dto.frequency !== undefined) request.frequency = dto.frequency;
    if (dto.startDate !== undefined) request.start_date = dto.startDate;
    if (dto.endDate !== undefined) request.end_date = dto.endDate;
    if (dto.isActive !== undefined) request.is_active = dto.isActive;
    return request;
  }

  getHabits(): Observable<Habit[]> {
    return this.http
      .get<HabitResponse[]>(this.apiUrl)
      .pipe(
        map((responses) =>
          responses.map((response) => this.mapResponseToHabit(response))
        )
      );
  }

  getHabit(id: number): Observable<Habit> {
    return this.http
      .get<HabitResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => this.mapResponseToHabit(response)));
  }

  createHabit(habit: CreateHabitDto): Observable<Habit> {
    const request = this.mapCreateDtoToRequest(habit);
    return this.http
      .post<HabitResponse>(this.apiUrl, request)
      .pipe(map((response) => this.mapResponseToHabit(response)));
  }

  updateHabit(id: number, habit: UpdateHabitDto): Observable<Habit> {
    const request = this.mapUpdateDtoToRequest(habit);
    return this.http
      .put<HabitResponse>(`${this.apiUrl}/${id}`, request)
      .pipe(map((response) => this.mapResponseToHabit(response)));
  }

  deleteHabit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
