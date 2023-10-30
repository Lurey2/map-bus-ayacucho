import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { Configuration } from './config/mega.config';
import { LoginComponent } from './pages/login/login.component';
import { InformacionComponent } from './pages/informacion/informacion.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InformacionComponent,
    ContactoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    MatNativeDateModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    Configuration
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
