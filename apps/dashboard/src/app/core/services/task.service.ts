// apps/dashboard/src/app/core/services/task.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap((tasks: Task[]) => this.tasksSubject.next(tasks))
    );
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(() => this.loadTasks().subscribe())
    );
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap(() => this.loadTasks().subscribe())
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadTasks().subscribe())
    );
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasksSubject.value.filter(task => task.status === status);
  }

  getTasksByCategory(category: string): Task[] {
    return this.tasksSubject.value.filter(task => task.category === category);
  }
}