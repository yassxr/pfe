import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; // Importez HttpClientModule
import { FormsModule } from '@angular/forms'; // Pour ngForm et ngModel
import { MatInputModule } from '@angular/material/input'; // Pour matInput
import { MatFormFieldModule } from '@angular/material/form-field'; // Pour mat-form-field
import { ReactiveFormsModule } from '@angular/forms'; // Importer ReactiveFormsModule
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { NavigationService } from './theme/layout/admin/navigation/navigation';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLogoComponent } from './theme/layout/admin/nav-bar/nav-logo/nav-logo.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { SharedModule } from './theme/shared/shared.module';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavigationComponent,
    NavLogoComponent,
    NavContentComponent,
    NavGroupComponent,
    NavItemComponent,
    NavCollapseComponent,
    ConfigurationComponent,
    GuestComponent,
  ],
  imports: [CommonModule, BrowserModule, HttpClientModule,     FormsModule, // Ajoutez FormsModule ici
    MatInputModule, // Ajoutez MatInputModule ici
    MatFormFieldModule,
    NgbModule,
    ReactiveFormsModule, // Ajoutez MatFormFieldModule ici// Ajoutez HttpClientModule ici
    AppRoutingModule, SharedModule, RouterModule, BrowserAnimationsModule],
  providers: [        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    NavigationService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule {}
