import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Filter } from '@shared/models/filter.model';
import { Task } from '@shared/models/task.model';
import { FilterToSpanishPipe } from '@shared/pipes/filter-to-spanish.pipe';
import { TaskComponent } from '@tasks/components/task/task.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    TaskComponent,
    FilterToSpanishPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  injector = inject(Injector);
  filter = signal<Filter>('all');
  hideFilter = signal(true);
  tasks = signal<Task[]>([]);
  tasksFiltered = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  });
  total = computed(() => {
    return this.tasksFiltered().length;
  });
  currentYear = computed(() => {
    return new Date().getFullYear();
  });
  newTaskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    const storage = window.localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }

    this.trackTasks();
  }

  trackTasks() {
    effect(
      () => {
        const tasks = this.tasks();
        localStorage.setItem('tasks', JSON.stringify(tasks));
      },
      { injector: this.injector }
    );
  }

  toggleHideFilter() {
    this.hideFilter.update((prev) => !prev);
  }

  handleFilterClick(value: 'all' | 'pending' | 'completed') {
    this.filter.set(value);
    this.toggleHideFilter();
  }

  getTasks(): Task[] {
    const tasks = window.localStorage.getItem('tasks');
    if (!tasks) return [];
    return JSON.parse(tasks);
  }

  addTask(task: Task) {
    this.tasks.update((currentTasks) => [...currentTasks, task]);
    this.filter.set('all');
    window.localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  updateTask(task: Task) {
    this.tasks.update((prevState) => {
      return prevState.map((t) => {
        if (t.id === task.id) {
          return {
            ...task,
          };
        }
        return t;
      });
    });
  }

  deleteTask(task: Task) {
    this.tasks.update((prevState) => prevState.filter((t) => t.id !== task.id));
  }

  handleSubmit() {
    if (this.newTaskForm.valid) {
      const title = this.newTaskForm.value.title?.trim();
      if (title) {
        const newTask: Task = {
          id: uuidv4(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        this.addTask(newTask);
        this.newTaskForm.reset();
      }
    }
  }
}
