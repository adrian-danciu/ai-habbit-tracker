import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HabitFormComponent } from './components/habit-form/habit-form.component';
import { HabitListComponent } from './components/habit-list/habit-list.component';

const routes: Routes = [
  {
    path: '',
    component: HabitListComponent,
  },
  {
    path: 'new',
    component: HabitFormComponent,
  },
  {
    path: 'edit/:id',
    component: HabitFormComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HabitListComponent,
    HabitFormComponent,
  ],
})
export class HabitsModule {}
