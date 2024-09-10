import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Importer ReactiveFormsModule

import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule // Ajouter ReactiveFormsModule ici
  ]
})
export class AuthenticationModule {}
