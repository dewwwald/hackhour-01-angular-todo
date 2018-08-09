import { Injectable, EventEmitter } from '@angular/core';
import { ITodo } from './todo.interface';
import { Observable, Subscription } from 'rxjs';
import deepFreeze from 'deep-freeze';

const INITIAL_DATA: ITodo[] = [
  { description: 'Add Karma and configure', completedStatus: false },
  { description: 'Add a test to see if adding form data will throw validation errors', completedStatus: false },
  { description: 'Add a test to see if adding form data renders', completedStatus: false },
];

@Injectable()
export class TodoService {
  private _todoList: ITodo[];

  private set todoList(value: ITodo[]) {
    this._todoList = deepFreeze(value);
  }

  private get todoList() {
    return this._todoList;
  }

  private todoList$: EventEmitter<null> = new EventEmitter<null>(false);

  constructor() {
    this.todoList = INITIAL_DATA;
  }

  addTodoChangeListener(callback: () => void): Subscription {
    return this.todoList$.subscribe(callback);
  }

  getTodoList(): Observable<ITodo[]> {
    // mock server request
    const observable: Observable<ITodo[]> = new Observable<ITodo[]>(observer => {
      const t = setTimeout(() => {
        observer.next(this.todoList);
        clearTimeout(t);
      }, 54);
      return () => {
        clearTimeout(t);
      }
    });
    return observable;
  }

  addTodoItem(text: string) {
    this.todoList = [...this.todoList, {
      description: text,
      completedStatus: false
    }];
    this.todoList$.emit();
  }

  markTodoAsComplete(index: number) {
    this.todoList = [...this.todoList].map((todoItem, i) => Object.assign({}, todoItem, {
      completedStatus: index === i ? true : todoItem.completedStatus
    }));
    this.todoList$.emit();
  }
}
