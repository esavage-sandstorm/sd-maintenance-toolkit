import { Injectable } from '@angular/core';
import {Observer, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataStorage: any = {
    status: {
      cronLastRun: 'TBD',
      fileSystemPermissions: 'TBD',
      configFileProtected: 'TBD',
      accesstoUpdatePhp: 'TBD',
      formSubmissionsTested: 'TBD',
      dbBackupRunning: 'TBD',
      siteUpdated: 'TBD',
      googleAnalyticsReporting: 'TBD',
      prodSSLExp: 'TBD',
      opCacheEnabled: 'TBD',
    }
  }

  _data = new BehaviorSubject<any>({})

  data() {
    return this._data.asObservable();
  }

  update(data: any) {
    Object.assign(this.dataStorage, data);
    this._data.next(this.dataStorage);
  }

  constructor() {
    this.update(this.dataStorage);
  }
}
