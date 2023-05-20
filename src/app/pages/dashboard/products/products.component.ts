import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { IProduct } from 'src/app/models/models';
import { DashboardService } from '../services/dashboard.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<IProduct>;

  constructor(
    private dashboardService: DashboardService,
    public dialog: MatDialog
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

  ngOnInit(): void {
    this.dashboardService.setUpdateState(true);

    this.subscription = this.dashboardService
      .shouldUpdate$()
      .subscribe(async (state) => {
        if (state) {
          this.isLoading = true;

          const res = await lastValueFrom(this.dashboardService.getProducts());

          this.products = res.data;

          this.dashboardService.setUpdateState(false);

          this.isLoading = false;
        }
      });
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

          // Open snackbar with res.success status and res.message
        } else {
          const res = await lastValueFrom(
            await this.dashboardService.deleteProduct(result.id)
          );

          // Open snackbar with res.success status and res.message
        }

        this.dashboardService.setUpdateState(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
