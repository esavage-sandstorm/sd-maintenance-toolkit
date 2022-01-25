import { Injectable, OnInit } from '@angular/core';
import { Observer, Observable,  BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  _client = new BehaviorSubject<any>({});
  clientData: any = null;
  cname: string = 'sd-maintenance-client';

  constructor(private cookies: CookieService) {
    var cvalue = this.cookies.get(this.cname);
    if (cvalue){
      var client = JSON.parse(cvalue);
      this.update(client);
    }
  }

  data() {
    return this._client.asObservable();
  }

  update(data: any){
    this.clientData = data;
    this.cookies.set(this.cname, JSON.stringify(data));
    this._client.next(data);
  }

  clear(): void {
    this.update(null);
  }

  clientSSH() {
    if (this.clientData) {
      return {
        "host": this.clientData.ssh.host,
        "username": this.clientData.ssh.user,
        "key_file": this.clientData.ssh.key_file,
        "port": this.clientData.ssh.port
      }
    } else {
      return false;
    }
  }
  // end class
}
