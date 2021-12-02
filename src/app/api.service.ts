import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  get(path: string) {
    return this.http.get('/api/'+path).toPromise().then(response => {
      return response;
    });
  };

  post(path: string, data: any) {
    return this.http.post('/api/'+path, data).toPromise().then(response => {
      return response;
    });
  };
}
