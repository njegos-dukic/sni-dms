import { Component, OnInit } from '@angular/core';
import { TempService } from 'src/app/services/temp.service';
import FileSaver from 'file-saver';
import { DMSFolder } from 'src/app/interfaces/dms-folder';
import { DMSFile } from 'src/app/interfaces/dms-file';
import { NewFile } from 'src/app/interfaces/file-upload';
import { MoveFile } from 'src/app/interfaces/file-move';
import { Log } from 'src/app/interfaces/log';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.css']
})
export class TempComponent implements OnInit {

  constructor(private tempService: TempService, private logService: LogService) { }

  public root!: DMSFolder;

  public currentFolder!: DMSFolder;
  public fullCurrentPath!: string;

  public previousFolders: DMSFolder[] = [];
  public previousPaths: string[] = [];

  public showUploadErrorToast: boolean = false;
  public showReplaceErrorToast: boolean = false;

  public moving: boolean = false;
  public selectedFile!: DMSFile;
  public srcFolder!: DMSFolder;
  public srcFolderString!: string;

  public creatingFolder: boolean = false;
  public newFolderName!: string;

  public logs: Log[] = [];
  public showLogs: boolean = false;
  public width: string = "78%";

  public isManager: boolean = false;

  public canCreate: boolean = false;
  public canRead: boolean = false;
  public canUpdate: boolean = false;
  public canDelete: boolean = false;

  public invalidIp: boolean = false;

  ngOnInit(): void {
    this.tempService.getFileStructure().subscribe(res => { 
      this.currentFolder = this.root = this.currentFolder = res;
      this.fullCurrentPath = this.currentFolder.name;
    }, () => { this.invalidIp = true; alert("Request came from an invalid IP address!"); this.logOut(); });

    this.tempService.getUser().subscribe(res => {
      this.canRead = res.canRead;
      this.canUpdate = res.canUpdate;
      this.canDelete = res.canDelete;
      this.canCreate = res.canCreate;
    });

    this.logService.getLogs().subscribe(res => { 
      this.logs = res.reverse();
      this.logs.forEach(l => l.dateTime = new Date(l.dateTime));
      this.showLogs = true;
      this.width = "58%";
      this.isManager = true;
    });

    this.tempService.isManager().subscribe(() => this.isManager = true);
  }

  public navigateTo(folder: DMSFolder) {
    this.creatingFolder = false;
    this.previousPaths.push(this.fullCurrentPath);
    this.previousFolders.push(this.currentFolder);
    this.fullCurrentPath += '\\' + folder.name;
    this.currentFolder = folder;
  }

  public goHome() {
    this.creatingFolder = false;
    this.navigateTo(this.root);
    this.fullCurrentPath = this.root.name;
  }

  public goBack() {
    this.creatingFolder = false;
    let previousFolder = this.previousFolders.pop();
    let previousPath = this.previousPaths.pop();

    if (!previousFolder && !previousPath) {
      return;
    }

    this.currentFolder = previousFolder!;
    this.fullCurrentPath = previousPath!;
  }

  public deleteFile(file: DMSFile) {
    this.moving = false;
    this.creatingFolder = false;
    this.tempService.delete(this.fullCurrentPath, file.name)
                    .subscribe(res => { 
                      if (res == true) {
                        this.currentFolder.files = this.currentFolder.files.filter(f => f != file) 
                      }
                    } 
                  );
  }

  public deleteFolder(folder: DMSFolder) {
    this.moving = false;
    this.creatingFolder = false;
    this.tempService.delete(this.fullCurrentPath, folder.name)
                    .subscribe(res => {
                      if (res == true) {
                        this.currentFolder.folders = this.currentFolder.folders.filter(f => f != folder);
                        this.previousFolders = this.previousFolders.filter(f => f != folder);
                      }
                    }
                  );
  }

  public uploadFile(file: any) {
    this.moving = false;
    this.creatingFolder = false;
    let f = file.target.files[0]

    if(!f) {
      return;
    }

    let ff = new File([f], f.name, { type: f.type });
    let fileDTO: NewFile = {
      file: ff,
      directory: this.fullCurrentPath
    }

    this.tempService.upload(fileDTO).subscribe(
      res => {
        this.currentFolder.files.push(res);
      }, 
      err => {
        this.showUploadErrorToast = true;
        setTimeout(() => this.showUploadErrorToast = false, 2500);
      }
    );
  }

  public replaceFile(newFile: any, oldFile: DMSFile) {
    this.moving = false;
    this.creatingFolder = false;
    let f = newFile.target.files[0]

    if(!f) {
      return;
    }

    let ff = new File([f], newFile.name, { type: f.type });
    let fileDTO: NewFile = {
      file: ff,
      directory: this.fullCurrentPath
    }

    this.tempService.replace(fileDTO, oldFile).subscribe(
      res => {
        this.currentFolder.files.splice(this.currentFolder.files.indexOf(oldFile), 1, res);
      }, 
      err => {
        this.showReplaceErrorToast = true;
        setTimeout(() => this.showReplaceErrorToast = false, 2500);
      }
    );
  }

  public moveFile(file: DMSFile) {
    this.moving = true;
    this.creatingFolder = false;
    this.selectedFile = file;
    this.srcFolder = this.currentFolder;
    this.srcFolderString = this.fullCurrentPath;
  }

  public confirmMove() {
    let transfer: MoveFile = {
      src: (<string> this.srcFolderString) + '\\' + this.selectedFile?.name,
      dst: this.fullCurrentPath + '\\' + this.selectedFile?.name 
    }
    this.tempService.move(transfer).subscribe(res => {
      this.moving = false;
      if (res == true) {
        this.srcFolder.files = this.srcFolder.files.filter(f => f != this.selectedFile);
        this.currentFolder.files.push(this.selectedFile);
      }
    });
  }

  public stopMove() {
    this.moving = false;
  }

  public createFolder() {
    this.creatingFolder = true;
    this.moving = false;
  }

  public confirmCreate() {
    if (this.newFolderName.length < 1)
      return;

    this.tempService.createNewDir(this.fullCurrentPath + '\\' + this.newFolderName.replace('..', '').replace('/', '-').replace('\\', '-'))
    .subscribe(res => {
      if (res != null) {
        this.currentFolder.folders.push(res);
        this.creatingFolder = false;
        this.newFolderName = '';
      }
    })
  }

  public stopCreate() {
    this.creatingFolder = false;
    this.newFolderName = '';
  }

  public logOut() {
    this.moving = false;
    this.creatingFolder = false;
    this.tempService.logOut();
  }

  public base64ToArrayBuffer(base64: string) {
    var binaryString =  window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++)        {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }

    return bytes;
  }

  public saveByteArray(file: DMSFile) {
    var blob = new Blob([this.base64ToArrayBuffer(file.content)], {type: "octet/stream"});
    FileSaver.saveAs(blob, file.name);
  }

  // public updateFile(file: any) {}
}


