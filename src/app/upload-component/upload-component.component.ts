import { Catalog } from './../Models/Catalog';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-component',
  templateUrl: './upload-component.component.html',
  styleUrls: ['./upload-component.component.css']
})
export class UploadComponentComponent implements OnInit {

  catalog: Catalog = new Catalog();
  formGroup!: FormGroup;
  categoryList = [];
  classificationList = [];
  documentTypeList = [];
  uploadedFile!: File;
  documentTypeSelectedName:string = "";
  catalogCreated:boolean = false;
  alternatesString:string = "Select the Alternate Categories";

  constructor(private http:HttpClient, private router: Router) {
    this.documentTypeSelectedName = "";
    this.createFormGroup();
    this.loadDocumentType();
    this.loadClassification();
    this.loadCategories();
   }

  ngOnInit(): void {

  }

  returnToAdminPage() {
    this.router.navigate(['/admin']);
  }

  addAlternate(nameSelectedEvent: any) {
    if(!this.alternatesString.includes(nameSelectedEvent.target.value) && nameSelectedEvent.target.value != this.formGroup.get("category")?.value) {
      if(this.alternatesString == "Select the Alternate Category")
      this.alternatesString = nameSelectedEvent.target.value;
      else {
        this.alternatesString = this.alternatesString + "," + nameSelectedEvent.target.value;
      }
    }
    this.formGroup.get("alternatecategory")?.setValue(this.alternatesString);
  }

  createFormGroup() {
    this.formGroup = new FormGroup({
      name: new FormControl("",[Validators.required]),
      author: new FormControl(""),
      citation: new FormControl(""),
      documentType: new FormControl("",[Validators.required]),
      classification: new FormControl("",[Validators.required]),
      category: new FormControl("",[Validators.required]),
      alternatecategory:new FormControl(""),
      file:new FormControl(),
      hyperlink:new FormControl()
   });
  }

  documentTypeSelected(docType:string) {
    this.documentTypeSelectedName = docType;
    if(docType != "Hyperlink") {
      this.formGroup.get('file')?.setValidators(Validators.required);
      this.formGroup.get('hyperlink')?.removeValidators;
    }
    else {
      this.formGroup.get('hyperlink')?.setValidators(Validators.required);
      this.formGroup.get('file')?.removeValidators;
    }
  }

  onClickSubmit(result: any) {
    this.catalog = new Catalog();
    this.catalog.name = result.name;
    this.catalog.documentName = this.catalog.name;
    if(result.author != "")
      this.catalog.author = result.author
    if(result.citation != "")
      this.catalog.author = result.citation
    this.documentTypeList.forEach(docType => {
      if(docType["name"] == result.documentType)
      this.catalog.documentTypeId = docType["id"];
    });
    this.classificationList.forEach(clasf => {
      if(clasf["name"] == result.classification)
      this.catalog.classificationId = clasf["id"];
    });
    this.categoryList.forEach(caty => {
      if(caty["name"] == result.category)
      this.catalog.categoryId = caty["id"];
    });
    if(this.documentTypeSelectedName == "Hyperlink")
      this.catalog.documentName = result.hyperlink;
    if(this.alternatesString != "Select the Alternate Category" && this.alternatesString != null) {
      this.catalog.alternateCategory = this.alternatesString;
    }
    this.createCatalog();
  }

  createCatalog() {
    if(this.catalog.name != null && this.catalog.categoryId != null && this.catalog.classificationId != null && this.catalog.documentTypeId != null) {
      this.http.post("http://localhost:9561/thesaurus/crud/create?entityName=Catalogue", this.catalog).subscribe((response:any)=>{
        if(response != null && response["status"] == "OK") {
          console.log(response["data"]);
          this.catalog = response["data"];
          if(this.documentTypeSelectedName != "Hyperlink")
            this.uploadFile();
          else {
            this.catalogCreated = true;
            this.createFormGroup();
          }
        }
      })
    }
  }

  selectFile(event: any) {
    this.uploadedFile = event.target.files[0];
  }

  uploadFile() {
    console.log(this.catalog.id, this.uploadedFile);
    const formData = new FormData();
    formData.append("file", this.uploadedFile);
    if(this.catalog.id != null && this.uploadedFile != null) {
      this.http.post("http://localhost:9561/thesaurus/business/addCatalogueDocument?catalogueId=" + String(this.catalog.id), formData).subscribe((response:any)=>{
        if(response != null && response["status"] == "OK") {
          console.log(response["data"]);
          this.catalogCreated = true;
          this.createFormGroup();
        }
      })
    }
  }

  loadCategories() {
    this.http.get("http://localhost:9561/thesaurus/crud/getAll?entityName=Category").subscribe((response:any)=>{
      if(response != null && response["status"] == "OK") {
        this.categoryList = response["data"];
        this.categoryList.sort((a, b) => a["name"] > b["name"] ? 1 : -1);
      }
    })
  }

  loadClassification() {
    this.http.get("http://localhost:9561/thesaurus/crud/getAll?entityName=Classification").subscribe((response:any)=>{
      if(response != null && response["status"] == "OK") {
        this.classificationList = response["data"];
        this.classificationList.sort((a, b) => a["name"] > b["name"] ? 1 : -1);
      }
    })
  }

  loadDocumentType() {
    this.http.get("http://localhost:9561/thesaurus/crud/getAll?entityName=DocumentType").subscribe((response:any)=>{
      if(response != null && response["status"] == "OK") {
        this.documentTypeList = response["data"];
        this.documentTypeList.sort((a, b) => a["name"] > b["name"] ? 1 : -1);
      }
    })
  }
}
