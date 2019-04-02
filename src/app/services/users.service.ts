import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';


export enum SearchType {
  all = '',
  weather = '',
  relief = 'relief',

}


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = 'http://127.0.0.1-5000'
//  apiKey = ''; //Enter key here!

  constructor(private http: HttpClientModule) { }

  //login_user(username: string, password: string): Observable<any>{
   // return this.http.post(`${this.url}/user/`, user)

  //}

  logout_user(){

  }

  signup_user(){

  }
}
