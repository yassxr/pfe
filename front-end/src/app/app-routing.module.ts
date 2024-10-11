import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './auth/auth.guard'; 

const routes: Routes = [
  {
    path: '',
    redirectTo: '/guest/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'default',
        loadComponent: () => import('./components/default/default.component').then((c) => c.DefaultComponent),
        canActivate: [AuthGuard], 
        data: { roles: ['EEP', 'AGENT'] },
      },
      {
        path: 'upload-document',
        loadComponent: () => import('./components/upload-document/upload-document.component').then(c => c.UploadDocumentComponent),
        canActivate: [AuthGuard],
        data: { roles: ['EEP'] }
      },
      {
        path: 'upload-validated',
        loadComponent: () => import('./components/upload-validated/upload-validated.component').then(c => c.UploadValidatedComponent),
        canActivate: [AuthGuard],
        data: { roles: ['EEP'] }
      },
      {
        path: 'upload-non-validated',
        loadComponent: () => import('./components/upload-non-validated/upload-non-validated.component').then(c => c.UploadNonValidatedComponent),
        canActivate: [AuthGuard],
        data: { roles: ['EEP'] }
      },
      {
        path: 'change-password',
        loadComponent: () => import('./components/change-password/change-password.component').then(c => c.ChangePasswordComponent)
      },
      {
        path: 'waiting-list',
        loadComponent: () => import('./components/waiting-list/waiting-list.component').then(c => c.WaitingListComponent),
        canActivate: [AuthGuard],
        data: { roles: ['AGENT'] }
      },
      {
        path: 'validated-list',
        loadComponent: () => import('./components/validated-list/validated-list.component').then(c => c.ValidatedListComponent),
        canActivate: [AuthGuard],
        data: { roles: ['AGENT'] }
      },
      {
        path: 'non-validated-list',
        loadComponent: () => import('./components/non-validated-list/non-validated-list.component').then(c => c.NonValidatedListComponent),
        canActivate: [AuthGuard],
        data: { roles: ['AGENT'] }
      },
      {
        path: 'create-eep',
        loadComponent: () => import('./components/create-eep/create-eep.component').then(c => c.CreateEepComponent),
        canActivate: [AuthGuard],
        data: { roles: ['AGENT'] }
      },
      {
        path: 'eep-active',
        loadComponent: () => import('./components/eep-active/eep-active.component').then(c => c.EepActiveComponent),
        canActivate: [AuthGuard],
        data: { roles: ['AGENT'] }
      },
      { path: 'edit-eep/:email', 
        loadComponent: () => import('./components/edit-eep/edit-eep.component').then(c => c.EditEepComponent),
        canActivate: [AuthGuard],
        data: { roles: ['AGENT'] }
       },
       { path: 'eep-old', 
        loadComponent: () => import('./components/eep-old/eep-old.component').then(c => c.EepOldComponent),
        canActivate: [AuthGuard],
        data: { roles: ['AGENT'] }
       },
       { path: 'unauthorized', 
        loadComponent: () => import('./components/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent),
       }

    ],
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
