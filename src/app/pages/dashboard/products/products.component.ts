import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { IProduct } from 'src/app/models/models';
import { DashboardService } from '../services/dashboard.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { SnackbarService } from 'src/app/components/snackbar/services/snackbar.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<IProduct>;

  constructor(
    private dashboardService: DashboardService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  subscription: Subscription = new Subscription();
  displayedColumns: string[] = [
    'id',
    'name' as 'Название',
    'price' as 'Цена',
    'description' as 'Описание',
  ];
  isLoading: boolean = true;
  products: IProduct[] = [];

  minutes: number = 0;
  seconds: number = 0;
  timer: any;

  ngOnInit(): void {
    this.dashboardService.setUpdateState(true);

    this.subscription = this.dashboardService
      .shouldUpdate$()
      .subscribe(async (state) => {
        if (state) {
          this.startTimer();

          this.isLoading = true;

          const res = await lastValueFrom(this.dashboardService.getProducts());

          this.products = res.data;

          this.dashboardService.setUpdateState(false);

          this.isLoading = false;

          this.snackbarService.open(
            `Данные получены за ${this.seconds} секунд`,
            'Закрыть',
            5000
          );

          this.stopTimer();
        }
      });
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.seconds++;

      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes++;
      }
    }, 1000);
  }

  stopTimer() {
    this.minutes = 0;
    this.seconds = 0;
    clearInterval(this.timer);
  }

  onCreate() {
    let dialogRef = this.dialog.open(ModalComponent, {
      data: {
        type: 'create',
        title: 'Добавить товар',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        const product = {
          name: result.name,
          price: result.price,
          description: result.description,
        };

        const res = await lastValueFrom(
          this.dashboardService.createProduct(product)
        );

        if (res.success) {
          this.dashboardService.setUpdateState(true);
        } else {
        }

        this.snackbarService.open(
          `${res.message}. ID: ${res.data._id}`,
          'Закрыть',
          5000
        );
      } catch (error) {}
    });
  }

  onRowClick(product: IProduct) {
    let dialogRef = this.dialog.open(ModalComponent, {
      data: {
        type: 'update',
        title: 'Редактировать товар',
        product,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if (result.type === 'update') {
          const res = await lastValueFrom(
            this.dashboardService.updateProduct(result)
          );

          this.snackbarService.open(res.message, 'Закрыть', 5000);
        } else {
          const res = await lastValueFrom(
            await this.dashboardService.deleteProduct(result.id)
          );

          this.snackbarService.open(res.message, 'Закрыть', 5000);
        }

        this.dashboardService.setUpdateState(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
