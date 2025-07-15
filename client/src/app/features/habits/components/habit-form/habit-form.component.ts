import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  CreateHabitDto,
  HabitService,
} from '../../../../core/services/habit.service';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="max-w-3xl mx-auto">
          <!-- Back Button -->
          <div class="mb-6">
            <button
              type="button"
              (click)="goBack()"
              class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <svg
                class="mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              Back to Habits
            </button>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ isEditMode ? 'Edit' : 'Create New' }} Habit
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                {{
                  isEditMode
                    ? 'Update your habit details'
                    : 'Add a new habit to track your progress'
                }}
              </p>
            </div>

            <!-- Loading State -->
            <div *ngIf="isLoading()" class="px-4 py-12 text-center">
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
              <p class="mt-2 text-sm text-gray-500">
                {{
                  isEditMode ? 'Loading habit details...' : 'Preparing form...'
                }}
              </p>
            </div>

            <!-- Error Message -->
            <div *ngIf="error()" class="mx-4 my-4 rounded-md bg-red-50 p-4">
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
                  <p class="mt-2 text-sm text-red-700">{{ error() }}</p>
                </div>
              </div>
            </div>

            <!-- Form -->
            <form
              *ngIf="!isLoading()"
              [formGroup]="habitForm"
              (ngSubmit)="onSubmit()"
              class="border-t border-gray-200"
            >
              <div class="px-4 py-5 space-y-6 sm:p-6">
                <!-- Name Field -->
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Habit Name
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      id="name"
                      formControlName="name"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      [ngClass]="{
                        'border-red-300 focus:ring-red-500 focus:border-red-500':
                          habitForm.get('name')?.invalid &&
                          habitForm.get('name')?.touched
                      }"
                    />
                  </div>
                  <p
                    *ngIf="
                      habitForm.get('name')?.invalid &&
                      habitForm.get('name')?.touched
                    "
                    class="mt-2 text-sm text-red-600"
                  >
                    Name is required
                  </p>
                </div>

                <!-- Description Field -->
                <div>
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div class="mt-1">
                    <textarea
                      id="description"
                      formControlName="description"
                      rows="3"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="What do you want to achieve with this habit?"
                    ></textarea>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    Brief description of your habit and its goals
                  </p>
                </div>

                <!-- Frequency Field -->
                <div>
                  <label
                    for="frequency"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Frequency
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <select
                      id="frequency"
                      formControlName="frequency"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    How often do you want to track this habit?
                  </p>
                </div>

                <!-- Start Date Field -->
                <div>
                  <label
                    for="startDate"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      type="date"
                      id="startDate"
                      formControlName="startDate"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      [min]="today"
                    />
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    When do you want to start this habit?
                  </p>
                </div>

                <!-- End Date Field -->
                <div>
                  <label
                    for="endDate"
                    class="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <div class="mt-1">
                    <input
                      type="date"
                      id="endDate"
                      formControlName="endDate"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      [min]="habitForm.get('startDate')?.value || today"
                    />
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    Optional: Set an end date if this is a temporary habit
                  </p>
                </div>

                <!-- Active Status -->
                <div class="relative flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="isActive"
                      type="checkbox"
                      formControlName="isActive"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="isActive" class="font-medium text-gray-700">
                      Active
                    </label>
                    <p class="text-gray-500">
                      Inactive habits won't appear in your daily tracking
                    </p>
                  </div>
                </div>
              </div>

              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  (click)="goBack()"
                  class="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="habitForm.invalid || isLoading()"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    *ngIf="isLoading()"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{
                    isLoading()
                      ? 'Saving...'
                      : isEditMode
                      ? 'Update Habit'
                      : 'Create Habit'
                  }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class HabitFormComponent implements OnInit, OnDestroy {
  habitForm: FormGroup;
  isEditMode = false;
  isLoading = signal(false);
  error = signal<string | null>(null);
  habitId: number | null = null;
  today = new Date().toISOString().split('T')[0];
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private habitService: HabitService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.habitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      frequency: ['daily', [Validators.required]],
      startDate: [this.today, [Validators.required]],
      endDate: [null],
      isActive: [true],
    });

    // Subscribe to startDate changes to update endDate min value
    this.subscriptions.add(
      this.habitForm.get('startDate')?.valueChanges.subscribe((startDate) => {
        const endDateControl = this.habitForm.get('endDate');
        if (endDateControl?.value && endDateControl.value < startDate) {
          endDateControl.setValue(startDate);
        }
      })
    );
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.habitId = +id;
      this.loadHabit(this.habitId);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadHabit(id: number) {
    this.isLoading.set(true);
    this.error.set(null);

    this.subscriptions.add(
      this.habitService.getHabit(id).subscribe({
        next: (habit) => {
          this.habitForm.patchValue({
            name: habit.name,
            description: habit.description,
            frequency: habit.frequency,
            startDate: habit.startDate?.split('T')[0],
            endDate: habit.endDate?.split('T')[0],
            isActive: habit.isActive,
          });
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading habit:', error);
          this.error.set('Failed to load habit details. Please try again.');
          this.isLoading.set(false);
        },
      })
    );
  }

  onSubmit() {
    if (this.habitForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      const habitData: CreateHabitDto = {
        ...this.habitForm.value,
        startDate: new Date(this.habitForm.value.startDate).toISOString(),
        endDate: this.habitForm.value.endDate
          ? new Date(this.habitForm.value.endDate).toISOString()
          : null,
      };

      const request =
        this.isEditMode && this.habitId
          ? this.habitService.updateHabit(this.habitId, habitData)
          : this.habitService.createHabit(habitData);

      this.subscriptions.add(
        request.subscribe({
          next: () => {
            this.router.navigate(['/habits']);
          },
          error: (error) => {
            console.error('Error saving habit:', error);
            this.error.set('Failed to save habit. Please try again.');
            this.isLoading.set(false);
          },
        })
      );
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.habitForm.controls).forEach((key) => {
        const control = this.habitForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  goBack() {
    this.router.navigate(['/habits']);
  }
}
