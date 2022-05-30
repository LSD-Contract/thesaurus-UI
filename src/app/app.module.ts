import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { UploadComponentComponent } from './upload-component/upload-component.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { CategoryComponent } from './category/category.component';
import { DocumentComponent } from './document/document.component';
import { ClassificationComponent } from './classification/classification.component';
import { CredentialsComponent } from './credentials/credentials.component';
import { MatSelectModule   } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponentComponent,
    LoginComponent,
    AdminComponent,
    CategoryComponent,
    DocumentComponent,
    ClassificationComponent,
    CredentialsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSelectModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
