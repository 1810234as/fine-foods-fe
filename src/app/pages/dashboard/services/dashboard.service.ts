import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProductResponceModel } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient,) { }

  getUserName(): string {
    let token = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1]));
    
    return token.name;
  }

  getProducts() {
    return this.httpClient.get<IProductResponceModel>(`${environment.api}products/`);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
  }
}
