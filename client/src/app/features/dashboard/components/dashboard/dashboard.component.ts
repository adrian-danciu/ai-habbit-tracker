import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Main Content -->
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Replace with dashboard content -->
        <div class="px-4 py-6 sm:px-0">
          <div
            class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4"
          >
            <div class="text-center">
              <h2 class="text-2xl font-semibold text-gray-800">
                Welcome to Your Dashboard
              </h2>
              <p class="mt-2 text-gray-600">
                Track your habits, monitor your progress, and get AI-powered
                suggestions to improve.
              </p>
            </div>

            <!-- Placeholder Stats -->
            <div
              class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              <!-- Active Habits -->
              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Active Habits
                  </dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
              </div>

              <!-- Completion Rate -->
              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Completion Rate
                  </dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">0%</dd>
                </div>
              </div>

              <!-- Current Streak -->
              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Current Streak
                  </dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">
                    0 days
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent {}
