import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Log } from '../interfaces/log';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  public getLogs(): Observable<Log[]> {
    let apiUrl = 'https://localhost:9000/logs'
    return this.http.get<Log[]>(apiUrl);
  }

  public logOut(): any {
    let apiUrl = "https://localhost:9001/logout";
    location.href = apiUrl;
  }
}
