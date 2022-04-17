import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './interfaces/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public users: User[] = [];
  public error: string = '';
  public noUsers: string = '';

  public date: Date = new Date();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(res => {
      this.error = '';
      this.noUsers = '';
      this.users = res;
      if (this.users.length == 0)
        this.noUsers = "No users.";
    },
    err => { 
      this.error = "Please log in as administrator!" 
    });
  }

  public logOut() {
    this.userService.logOut();
  }

  public updateUser(user: User) {
    console.log(user);
    this.userService.updateUser(user).subscribe(res => console.log("END"));
  }

  public toggleCreate(user: User) {
    user.canCreate = !user.canCreate;
  }

  public toggleRead(user: User) {
    user.canRead = !user.canRead;
  }

  public toggleUpdate(user: User) {
    user.canUpdate = !user.canUpdate;
  }

  public toggleDelete(user: User) {
    user.canDelete = !user.canDelete;
  }
}
