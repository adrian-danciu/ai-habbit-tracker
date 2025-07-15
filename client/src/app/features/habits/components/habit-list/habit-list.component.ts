import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { Habit, HabitService } from '../../../../core/services/habit.service';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">Your Habits</h2>
            <p class="mt-1 text-sm text-gray-600">
              Track and manage your daily, weekly, and monthly habits
            </p>
          </div>
          <a
            routerLink="/habits/new"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              class="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Create New Habit
          </a>
        </div>

        <ng-container *ngIf="state$ | async as state">
          <!-- Loading State -->
          <div *ngIf="state.loading" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">Loading your habits...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="state.error" class="rounded-md bg-red-50 p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error</h3>
                <p class="mt-2 text-sm text-red-700">{{ state.error }}</p>
                <button
                  (click)="refresh()"
                  class="mt-2 text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            *ngIf="
              !state.loading &&
              !state.error &&
              (!state.habits || state.habits.length === 0)
            "
            class="text-center py-12 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300"
          >
            <div class="p-12">
              <div class="mx-auto h-24 w-24 text-gray-400">
                <svg
                  class="h-full w-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h32M8 24h32M8 36h16M35.5 34.5l-7 7M28.5 34.5l7 7"
                  />
                </svg>
              </div>
              <h3 class="mt-4 text-xl font-semibold text-gray-900">
                Start Your Journey
              </h3>
              <p class="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                You haven't created any habits yet. Create your first habit and
                begin tracking your progress towards your goals.
              </p>
              <div class="mt-8">
                <a
                  routerLink="/habits/new"
                  class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    class="-ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Create Your First Habit
                </a>
              </div>
              <div class="mt-4">
                <p class="text-sm text-gray-500">
                  Need inspiration? Check out our
                  <a href="#" class="text-indigo-600 hover:text-indigo-500">
                    habit suggestions
                  </a>
                  or
                  <a href="#" class="text-indigo-600 hover:text-indigo-500">
                    browse templates
                  </a>
                </p>
              </div>
            </div>
          </div>

          <!-- Habits List -->
          <div
            *ngIf="!state.loading && state.habits && state.habits.length > 0"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div
              *ngFor="let habit of state.habits"
              class="relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <!-- Status Badge -->
              <span
                class="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                [ngClass]="{
                  'bg-green-100 text-green-800': habit.isActive,
                  'bg-gray-100 text-gray-800': !habit.isActive
                }"
              >
                {{ habit.isActive ? 'Active' : 'Inactive' }}
              </span>

              <!-- Habit Content -->
              <div class="flex flex-col h-full">
                <h3 class="text-lg font-medium text-gray-900 pr-20">
                  {{ habit.name }}
                </h3>
                <p
                  *ngIf="habit.description"
                  class="mt-1 text-sm text-gray-500 flex-grow"
                >
                  {{ habit.description }}
                </p>

                <!-- Habit Details -->
                <div class="mt-4 border-t border-gray-100 pt-4">
                  <div class="flex items-center text-sm text-gray-500">
                    <svg
                      class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ habit.frequency | titlecase }}
                  </div>

                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <svg
                      class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Started {{ habit.startDate | date }}
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-4 flex justify-end space-x-3">
                  <button
                    (click)="editHabit(habit)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      class="-ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    (click)="deleteHabit(habit)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg
                      class="-ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [],
})
export class HabitListComponent implements OnInit {
  private refresh$ = new BehaviorSubject<void>(undefined);

  state$ = this.refresh$.pipe(switchMap(() => this.loadHabits()));

  constructor(private habitService: HabitService, private router: Router) {}

  ngOnInit() {}

  private loadHabits() {
    return this.habitService.getHabits().pipe(
      map((habits) => ({
        loading: false,
        habits,
        error: null,
      })),
      catchError((error) => {
        console.error('Error loading habits:', error);
        return of({
          loading: false,
          habits: [],
          error: 'Failed to load habits. Please try again.',
        });
      }),
      startWith({
        loading: true,
        habits: [],
        error: null,
      })
    );
  }

  refresh() {
    this.refresh$.next();
  }

  editHabit(habit: Habit) {
    this.router.navigate(['/habits/edit', habit.id]);
  }

  deleteHabit(habit: Habit) {
    if (
      confirm(
        'Are you sure you want to delete this habit? This action cannot be undone.'
      )
    ) {
      this.habitService.deleteHabit(habit.id).subscribe({
        next: () => {
          this.refresh();
        },
        error: (error) => {
          console.error('Error deleting habit:', error);
        },
      });
    }
  }
}
