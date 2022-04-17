import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    let apiUrl = 'https://localhost:9000/users'
    return this.http.get<User[]>(apiUrl);
  }

  public updateUser(user: User): Observable<User> {
    let apiUrl = 'https://localhost:9000/users';
    return this.http.post<User>(apiUrl, user);
  }

  public logOut(): any {
    let apiUrl = "https://localhost:9000/logout";
    location.href = apiUrl;
  }

  public isManager(user: string): Observable<boolean> {
    let apiUrl = 'https://localhost:9000/users/manager?username=' + user;
    return this.http.get<boolean>(apiUrl);
  }
}
