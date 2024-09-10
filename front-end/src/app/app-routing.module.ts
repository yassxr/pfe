import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './auth/auth.guard'; // Import the AuthGuard

const routes: Routes = [
  {
    path: '',
    redirectTo: '/guest/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard], // Protect routes with AuthGuard
    children: [
      {
        path: 'default',
        loadComponent: () => import('./components/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./components/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./components/elements/element-color/element-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./components/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: 'guest',
    component: GuestComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./components/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
