import { Injectable, OnInit } from '@angular/core';
import { Observer, Observable,  BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  _client = new BehaviorSubject<any>({});
  clientData: any = null;

  constructor() {}

  data() {
    return this._client.asObservable();
  }

  update(data: any){
    this.clientData = data;
    this._client.next(data);
  }

  clear(): void {
    this.update(null);
  }
}
