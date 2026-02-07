// apps/dashboard/src/app/features/tasks/components/task-form/task-form.component.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { Task, TaskStatus, TaskCategory } from '../../../../core/models/models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Modal Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ task ? 'Edit Task' : 'Create New Task' }}
          </h2>
        </div>

        <!-- Form -->
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="p-6">
          <!-- Title -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter task title"
            />
            <p *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" 
               class="mt-1 text-sm text-red-600 dark:text-red-400">
              Title is required
            </p>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              formControlName="description"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter task description"
            ></textarea>
            <p *ngIf="taskForm.get('description')?.invalid && taskForm.get('description')?.touched" 
               class="mt-1 text-sm text-red-600 dark:text-red-400">
              Description is required
            </p>
          </div>

          <!-- Status -->
          <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              id="status"
              formControlName="status"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option [value]="TaskStatus.TODO">To Do</option>
              <option [value]="TaskStatus.IN_PROGRESS">In Progress</option>
              <option [value]="TaskStatus.DONE">Done</option>
            </select>
          </div>

          <!-- Category -->
          <div class="mb-6">
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              id="category"
              formControlName="category"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option [value]="TaskCategory.WORK">Work</option>
              <option [value]="TaskCategory.PERSONAL">Personal</option>
            </select>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              type="button"
              (click)="cancel.emit()"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="taskForm.invalid || loading"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Saving...' : (task ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;
  loading = false;
  errorMessage = '';

  TaskStatus = TaskStatus;
  TaskCategory = TaskCategory;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [TaskStatus.TODO, Validators.required],
      category: [TaskCategory.WORK, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        category: this.task.category
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const taskData = this.taskForm.value;

      const request = this.task
        ? this.taskService.updateTask(this.task.id, taskData)
        : this.taskService.createTask(taskData);

      request.subscribe({
        next: () => {
          this.save.emit();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'An error occurred';
          this.loading = false;
        }
      });
    }
  }
}