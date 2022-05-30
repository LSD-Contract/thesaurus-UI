import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicModel } from '../Models/BasicModel';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.css']
})
export class ClassificationComponent implements OnInit {

  classificationFormGroup!: FormGroup;
  notification = "";
  classification: BasicModel = new BasicModel();

  constructor(private router: Router, private http:HttpClient) { }

  emptyFormCreate() {
    this.classificationFormGroup = new FormGroup({
      classificationName: new FormControl("",[Validators.required])
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
    if(result.classificationName != null && result.classificationName != "") {
      this.classification.name = result.classificationName;
      this.http.post("http://localhost:9561/thesaurus/crud/create?entityName=Classification", this.classification).subscribe((response:any)=>{
        if(response != null && response["status"] == "OK") {
          this.notification = "New Classification has been created";
          this.emptyFormCreate();
        } else {
          if(response.message == "Server failed with error : Classification already exists") {
            this.notification = "Classification already exists";
          }
        }
      })
    }
  }


}
