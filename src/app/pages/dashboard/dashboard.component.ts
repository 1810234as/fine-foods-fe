import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private route: Router, private dashboardService: DashboardService) {
    this.currentUrl = this.route.routerState.snapshot.url.split('/').pop();
  }

  links = [
    {
      title: 'Продукты',
      path: 'products',
      icon: 'fastfood',
    },
    {
      title: 'Категории',
      path: 'categories',
      icon: 'layers',
    },
  ];

  isDrawerOpen = false;
  currentUrl?: string = 'products';
  userName: string = 'Пользователь';

  ngOnInit(): void {
    this.userName = this.dashboardService.getUserName();
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  logout(){
    this.dashboardService.logout();
    this.route.navigate(['/auth/login']);
  }
}
