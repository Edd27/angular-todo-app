import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '@shared/models/task.model';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;
  @Output() updateTask = new EventEmitter();
  @Output() deleteTask = new EventEmitter();
  isHovered = signal(false);
  editTittleCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  ngOnInit() {
    this.editTittleCtrl.setValue(this.task.title);
  }

  disableHover() {
    this.isHovered.set(false);
  }

  enableHover() {
    this.isHovered.set(true);
  }

  handleCheck() {
    const taskCompleted: Task = {
      ...this.task,
      completed: !this.task.completed,
    };

    this.updateTask.emit(taskCompleted);
  }

  handleTitleChange() {
    if (this.editTittleCtrl.valid) {
      const value = this.editTittleCtrl.value.trim();

      if (value) {
        const taskUpdated = {
          ...this.task,
          title: value,
        };

        this.updateTask.emit(taskUpdated);
      }
    }
  }

  handleDelete() {
    this.deleteTask.emit(this.task);
  }
}
