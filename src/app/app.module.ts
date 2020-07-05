import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SheetModule } from './sheet-module/sheet.module';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SheetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
