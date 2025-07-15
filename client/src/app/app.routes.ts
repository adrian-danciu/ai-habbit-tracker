import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'habits',
        loadChildren: () =>
          import('./features/habits/habits.module').then((m) => m.HabitsModule),
      },
      {
        path: 'logging',
        loadChildren: () =>
          import('./features/logging/logging.module').then(
            (m) => m.LoggingModule
          ),
      },
      {
        path: 'suggestions',
        loadChildren: () =>
          import('./features/suggestions/suggestions.module').then(
            (m) => m.SuggestionsModule
          ),
      },
    ],
  },
];
