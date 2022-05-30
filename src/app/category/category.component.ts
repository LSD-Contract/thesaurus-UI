import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicModel } from '../Models/BasicModel';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryFormGroup!: FormGroup;
  notification = "";
  category: BasicModel = new BasicModel();

  constructor(private router: Router, private http:HttpClient) { }

  emptyFormCreate() {
    this.categoryFormGroup = new FormGroup({
      categoryName: new FormControl("",[Validators.required])
   });
  }

  ngOnInit(): void {
    this.emptyFormCreate();
   this.notification = "";
  }

  returnToAdminPage() {
    this.router.navigate(['/admin']);
  }

  onSubmit(result: any) {
    this.notification = "";
    console.log();
    if(result.categoryName != null && result.categoryName != "") {
      this.category.name = result.categoryName;
      this.http.post("http://localhost:9561/thesaurus/crud/create?entityName=Category", this.category).subscribe((response:any)=>{
        if(response != null && response["status"] == "OK") {
          this.notification = "New Category has been created";
          this.emptyFormCreate();
        } else {
          if(response.message == "Server failed with error : Category already exists") {
            this.notification = "Category already exists";
          }
        }
      })
    }
  }


}
