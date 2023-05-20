import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { IProduct, IProductResponceModel } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private httpClient: HttpClient) {}

  private isUpdated$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  shouldUpdate$() {
    return this.isUpdated$.asObservable().pipe(observeOn(asyncScheduler));
  }

  setUpdateState(value: boolean) {
    this.isUpdated$.next(value);
  }

  getUserName(): string {
    let token = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1]));

    return token.name;
  }

  getProducts() {
    return this.httpClient.get<IProductResponceModel>(
      `${environment.api}products/`
    );
  }

  createProduct(product: { name: string; price: number; description: string }) {
    return this.httpClient.post<{
      success: boolean;
      data: IProduct;
      message?: string;
    }>(`${environment.api}products/create`, product);
  }

  updateProduct(product: IProduct) {
    return this.httpClient.put<{
      success: boolean;
      data: IProduct;
      message?: string;
    }>(`${environment.api}products/update/${product.id}`, product);
  }

  async  deleteProduct(id: string) {
    return this.httpClient.delete<{
      success: boolean;
      message: string;
    }>(`${environment.api}products/delete/${id}`);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
  }
}
