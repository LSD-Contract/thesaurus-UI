import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicModel } from '../Models/BasicModel';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  documentFormGroup!: FormGroup;
  notification = "";
  documentType: BasicModel = new BasicModel();

  constructor(private router: Router, private http:HttpClient) { }

  emptyFormCreate() {
    this.documentFormGroup = new FormGroup({
      documentName: new FormControl("",[Validators.required])
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
    if(result.documentName != null && result.documentName != "") {
      this.documentType.name = result.documentName;
      this.http.post("http://localhost:9561/thesaurus/crud/create?entityName=DocumentType", this.documentType).subscribe((response:any)=>{
        if(response != null && response["status"] == "OK") {
          this.notification = "New Document Extension has been created";
          this.emptyFormCreate();
        } else {
          console.log(response);

          if(response.message == "Server failed with error : DocumentType already exists") {
            this.notification = "Document Extension already exists";
          }
        }
      })
    }
  }


}
