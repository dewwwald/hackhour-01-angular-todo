import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoService } from '../todo.service';
import { Subscription } from '../../../node_modules/rxjs';
import { ITodo } from '../todo.interface';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  private subscriptionList: Subscription[] = [];
  private todoList: ITodo[] = [];
  private newTodo: { description: string } = {
    description: ''
  };

  constructor(private todoService: TodoService) {}

  ngOnDestroy() {
    this.subscriptionList.forEach(x => {
      x.unsubscribe();
    });
  }

  ngOnInit() {
    this.getTodoList();
    this.subscriptionList.push(
      this.todoService.addTodoChangeListener(() => {
        this.getTodoList();
      })
    );
  }

  onStatusToggle(index: number) {
    this.todoService.markTodoAsComplete(index);
  }

  resetNewTodo() {
    this.newTodo = {
      description: '',
    };
  }

  addNewTodo() {
    this.todoService.addTodoItem(this.newTodo.description);
    this.resetNewTodo();
  }

  getTodoList() {
    const subscription = this.todoService.getTodoList().subscribe(todoList => {
      this.todoList = todoList;
      subscription.unsubscribe();
    });
  }
}
