import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';

const TOKEN_KEY = 'Authorization';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = environment.url;
  user = null;
  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private plt: Platform, private http: HttpClient,
    private helper: JwtHelperService, private alertController: AlertController) { 
    this.plt.ready().then(() =>{
      this.checkToken();
    });

  }

  login(credentials) {
    console.log('email', credentials);
    return this.http.post(`${this.url}/auth/login`, credentials)
      .pipe(
        tap(res => {
          // this.storage.set(TOKEN_KEY, res['token']);
          // this.user = this.helper.decodeToken(res['token']);
          this.authenticationState.next(true);
        }),
        // catchError(e => {
        //   this.showAlert(e.error.msg);
        //   throw new Error(e);
        // })
      );
  }

  logout(){
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated(){
    return this.authenticationState.value;
  }

  checkToken(){
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);
 
        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
}
  register(credentials) {
    return this.http.post(`${this.url}/user/register`, credentials).pipe(
      catchError(e => {
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }
  getSpecialData() {
    return this.http.get(`${this.url}/api/special`).pipe(
      catchError(e => {
        let status = e.status;
        if (status === 401) {
          this.showAlert('You are not authorized for this!');
          this.logout();
        }
        throw new Error(e);
      })
    )
  }
  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
}
  
