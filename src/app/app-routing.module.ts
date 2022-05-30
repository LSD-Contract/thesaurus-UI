import { AdminComponent } from './admin/admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UploadComponentComponent } from './upload-component/upload-component.component';
import { CategoryComponent } from './category/category.component';
import { ClassificationComponent } from './classification/classification.component';
import { DocumentComponent } from './document/document.component';
import { CredentialsComponent } from './credentials/credentials.component';

const routes: Routes = [
  { path: 'upload', component: UploadComponentComponent},
  { path: 'login', component: LoginComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'category', component: CategoryComponent},
  { path: 'document', component: DocumentComponent},
  { path: 'classification', component: ClassificationComponent},
  { path: 'credentials', component: CredentialsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
