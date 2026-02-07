// apps/dashboard/src/app/features/tasks/components/task-card/task-card.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../core/models/models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-move">
      <!-- Category Badge -->
      <div class="flex justify-between items-start mb-2">
        <span 
          [class]="task.category === 'Work' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'"
          class="px-2 py-1 text-xs font-semibold rounded-full"
        >
          {{ task.category }}
        </span>
        
        <!-- Actions -->
        <div class="flex gap-1" *ngIf="canEdit || canDelete">
          <button
            *ngIf="canEdit"
            (click)="edit.emit()"
            class="p-1 hover:bg-gray-100 rounded transition"
            title="Edit"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            *ngIf="canDelete"
            (click)="delete.emit()"
            class="p-1 hover:bg-red-100 rounded transition"
            title="Delete"
          >
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Task Title -->
      <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ task.title }}
      </h3>

      <!-- Task Description -->
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ task.description }}
      </p>

      <!-- Task Footer -->
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span *ngIf="task.assignedTo">
          Assigned to: {{ task.assignedTo.name }}
        </span>
        <span *ngIf="!task.assignedTo">
          Unassigned
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() canEdit = false;
  @Input() canDelete = false;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}