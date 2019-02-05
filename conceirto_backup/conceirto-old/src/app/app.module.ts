import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './home/header/header.component';
import { BodyComponent } from './home/body/body.component';
import { FooterComponent } from './home/footer/footer.component';
import { MainsliderComponent } from './home/body/mainslider/mainslider.component';
import { Slider1Component } from './home/body/slider1/slider1.component';
import { Slider2Component } from './home/body/slider2/slider2.component';
import { FormComponent } from './home/body/form/form.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    BodyComponent,
    FooterComponent,
    MainsliderComponent,
    Slider1Component,
    Slider2Component,
    FormComponent
  ],
  imports: [
    BrowserModule,BrowserAnimationsModule,MatButtonModule,MatCheckboxModule,MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
