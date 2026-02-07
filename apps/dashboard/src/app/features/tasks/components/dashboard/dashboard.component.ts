// apps/dashboard/src/app/features/tasks/components/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AuthService } from '../../../../core/services/auth.service';
import { TaskService } from '../../../../core/services/task.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { Task, TaskStatus, TaskCategory, User } from '../../../../core/models/models';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  showTaskForm = false;
  editingTask: Task | null = null;
  
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  
  selectedCategory: TaskCategory | 'all' = 'all';
  searchTerm = '';
  sortBy: 'date' | 'title' = 'date';

  TaskStatus = TaskStatus;
  TaskCategory = TaskCategory;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Dashboard initialized');
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Current user:', user);
      console.log('Can create?', this.authService.canCreate());
    });

    this.loadTasks();
  }

  loadTasks(): void {
    console.log('Loading tasks...');
    this.taskService.loadTasks().subscribe({
      next: (tasks) => {
        console.log('Tasks loaded:', tasks);
        this.updateTaskLists();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  updateTaskLists(): void {
    let tasks = this.taskService.getTasks();
    console.log('Updating task lists, total tasks:', tasks.length);

    // Apply filters
    if (this.selectedCategory !== 'all') {
      tasks = tasks.filter(t => t.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(term) || 
        t.description.toLowerCase().includes(term)
      );
    }

    // Sort tasks
    tasks.sort((a, b) => {
      if (this.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Group by status
    this.todoTasks = tasks.filter(t => t.status === TaskStatus.TODO);
    this.inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
    this.doneTasks = tasks.filter(t => t.status === TaskStatus.DONE);

    console.log('Todo:', this.todoTasks.length, 'In Progress:', this.inProgressTasks.length, 'Done:', this.doneTasks.length);
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      
      // Update task status on backend
      this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
        next: () => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        },
        error: (error) => {
          console.error('Error updating task:', error);
        }
      });
    }
  }

  changeTaskStatus(task: Task, newStatus: TaskStatus): void {
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

  openCreateTaskForm(): void {
    console.log('Opening create task form');
    this.editingTask = null;
    this.showTaskForm = true;
  }

  openEditTaskForm(task: Task): void {
    this.editingTask = task;
    this.showTaskForm = true;
  }

  closeTaskForm(): void {
    this.showTaskForm = false;
    this.editingTask = null;
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  onTaskSaved(): void {
    this.closeTaskForm();
    this.loadTasks();
  }

  onCategoryChange(category: TaskCategory | 'all'): void {
    this.selectedCategory = category;
    this.updateTaskLists();
  }

  onSortChange(sortBy: 'date' | 'title'): void {
    this.sortBy = sortBy;
    this.updateTaskLists();
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.updateTaskLists();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
}