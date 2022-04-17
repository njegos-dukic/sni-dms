import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DMSFile } from '../interfaces/dms-file';
import { DMSFolder } from '../interfaces/dms-folder';
import { MoveFile } from '../interfaces/file-move';
import { NewFile } from '../interfaces/file-upload';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class TempService {

  constructor(private http: HttpClient) { }
  
  public getFileStructure(): Observable<DMSFolder> {
    let apiUrl = 'https://localhost:9001/directory';
    return this.http.get<DMSFolder>(apiUrl);
  }

  public delete(currentPath: string, iNodeName: string): Observable<any> {
    let apiUrl = 'https://localhost:9001/directory';
    let body = currentPath + '/' + iNodeName;
    return this.http.post(apiUrl, body);
  }

  public logOut(): any {
    let apiUrl = "https://localhost:9001/logout";
    location.href = apiUrl;
  }

  public upload(newFileDTO: NewFile): Observable<DMSFile> {
    let apiUrl = 'https://localhost:9001/directory/upload?path=' + encodeURIComponent(newFileDTO.directory);
    const formData = new FormData();
    formData.append("file", newFileDTO.file, newFileDTO.file.name);
    return this.http.post<DMSFile>(apiUrl, formData);
  }

  public replace(newFileDTO: NewFile, currentFile: DMSFile): Observable<DMSFile> {
    let apiUrl = 'https://localhost:9001/directory/replace?path=' + encodeURIComponent(newFileDTO.directory) + encodeURIComponent("\\") + encodeURIComponent(currentFile.name);
    const formData = new FormData();
    formData.append("file", newFileDTO.file, newFileDTO.file.name);
    return this.http.post<DMSFile>(apiUrl, formData);
  }

  public move(moveFile: MoveFile): Observable<any> {
    let apiUrl = 'https://localhost:9001/directory/move';
    return this.http.post(apiUrl, moveFile);
  }

  public createNewDir(path: string): Observable<DMSFolder> {
    let apiUrl = 'https://localhost:9001/directory/new';
    return this.http.post<DMSFolder>(apiUrl, path);
  }

  public isManager(): Observable<boolean> {
    let apiUrl = 'https://localhost:9001/manager';
    return this.http.get<boolean>(apiUrl);
  }

  public getUser(): Observable<User> {
    let apiUrl = 'https://localhost:9001/users';
    return this.http.get<User>(apiUrl);
  }
}
