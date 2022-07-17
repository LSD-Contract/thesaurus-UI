import { BasicModel } from './Models/BasicModel';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Catalog } from './Models/Catalog';
import { DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { Form, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'The Thesaurus of Wit and Humor';
  bookTitle = 'The Ultimate Reference Book : A Thesaurus of Wit and Humor (1994)';
  myLinkedIn = "https://www.linkedin.com/in/vijayadithya-doddi/";
  showFilter = false;
  showAdditionalFilter = false;
  categoryList = [];
  classificationList = [];
  selectedCategoryName:string = "";
  filteredClassificationList : string[] = [];
  filteredAdditionalCategoriesList = [];
  selectedAdditionalCategories: string[] = [];
  filteredCategoryList = [];
  catalogList: Array<Catalog> = [];
  filteredCatalogList: Array<Catalog> = [];
  columnsToDisplay = ["name","type","link","author","citation","classification","AdditionalCategories"];
  selectedCategory:number = -1;
  uploadPageOpenBool: boolean = false;
  loginPageOpenBool: boolean = false;
  searchControl: FormControl;
  searchAdditionalControl: FormControl;
  constructor(private http:HttpClient, private sanitizer:DomSanitizer) {
    this.uploadPageOpenBool = false
    this.loadCategories();
    this.loadClassification();
    this.searchControl = new FormControl();
    this.searchAdditionalControl = new FormControl();
    this.searchControl.valueChanges.subscribe(newSearch => {
      this.categoryList.forEach(() => {
        if(!newSearch){
          this.assignUnfilteredCategories();
        }
        this.filteredCategoryList = Object.assign([], this.categoryList).filter(
           item => String(item["name"]).toLowerCase().indexOf(newSearch.toLowerCase()) > -1
        )
      })
    });
    this.searchAdditionalControl.valueChanges.subscribe(newSearch => {
      if(newSearch != null) {
        this.categoryList.forEach(() => {
          this.filteredAdditionalCategoriesList = Object.assign([], this.categoryList).filter(
            item => String(item["name"]).toLowerCase().indexOf(newSearch.toLowerCase()) > -1
          )
        })
      }
    })
  }

  ngOnInit(): void {
    this.uploadPageOpenBool = false
    this.loadCategories();
    this.loadClassification();
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.subscribe(newSearch => {
      this.categoryList.forEach(() => {
        if(!newSearch){
          this.assignUnfilteredCategories();
        }
        this.filteredCategoryList = Object.assign([], this.categoryList).filter(
           item => String(item["name"]).toLowerCase().indexOf(newSearch.toLowerCase()) > -1
        )
      })
    })
  }

  assignUnfilteredCategories() {
    this.filteredCategoryList = this.categoryList;
  }

  getLink(url:string):SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

 loadCategories() {
    this.http.get("http://localhost:9561/thesaurus/crud/getAll?entityName=Category").subscribe((response:any)=>{
      if(response != null && response["status"] == "OK") {
        this.categoryList = response["data"];
        this.categoryList.sort((a, b) => a["name"] > b["name"] ? 1 : -1);
        this.assignUnfilteredCategories();
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

  loadCatalogForCategory(categoryId :string, categoryName:string) {
    this.selectedCategoryName = categoryName;
    this.http.get("http://localhost:9561/thesaurus/crud/getAllWithPagination?entityName=Catalogue&fieldName=categoryId&valueToMatch="+categoryId).subscribe((response:any)=>{
      if(response != null && response["status"] == "OK") {
        this.catalogList = response["data"]["content"];
        this.selectedCategory = +categoryId
        this.catalogList.forEach((c:Catalog) => {
          this.http.get("http://localhost:9561/thesaurus/crud/getAllWithPagination?entityName=DocumentType&fieldName=id&valueToMatch="+c.documentTypeId).subscribe((response:any)=>{
            if(response != null && response["status"] == "OK") {
              c.documentType=response["data"]["content"][0]["name"];
            }
          })
          this.http.get("http://localhost:9561/thesaurus/crud/getAllWithPagination?entityName=Classification&fieldName=id&valueToMatch="+c.classificationId).subscribe((response:any)=>{
            if(response != null && response["status"] == "OK") {
              c.classification=response["data"]["content"][0]["name"];
              this.modifyCatalogList();
            }
          })
          if(c.documentType != "Hyperlink" && c.savedfilename != null) {
            this.http.get("http://localhost:9561/thesaurus/business/downloadDocument?documentName="+c.savedfilename, { responseType: 'blob' }).subscribe((response:any)=>{
              if(response != null) {
              c.file = response;
              c.documentName = c.name + "." + c.documentType;
              }
            })
          }
        })
        this.modifyCatalogList();
      }
    })
  }

  downloadFile(fileSelectedCatalog: Catalog): void {
    const url= window.URL.createObjectURL(fileSelectedCatalog.file);
    console.log(fileSelectedCatalog.documentName);
    const anchor = document.createElement("a");
    anchor.download = fileSelectedCatalog.documentName;
    anchor.href = url;
    anchor.click();

//    window.open(url);
  }

  filterClassification(classification:BasicModel) {
    if(this.filteredClassificationList.indexOf(classification.name) == -1)
      this.filteredClassificationList.push(classification.name);
    else {
      this.filteredClassificationList.forEach((value, index) => {
        if(value == classification.name) {
          this.filteredClassificationList.splice(index , 1);
        }
      });
    }
    this.modifyCatalogList();
  }

  filterAdditionalCategory(categoryName:string) {
    if(this.selectedAdditionalCategories.indexOf(categoryName) == -1)
      this.selectedAdditionalCategories.push(categoryName);
    else {
      this.selectedAdditionalCategories.forEach((value, index) => {
        if(value == categoryName) {
          this.selectedAdditionalCategories.splice(index , 1);
        }
      });
    }
    this.modifyCatalogList();
  }

  AdditionalFilter() {
    this.selectedAdditionalCategories = [];
  }

  modifyCatalogList() {
    this.filteredCatalogList = [];
    if(this.filteredClassificationList.length != 0 && this.selectedAdditionalCategories.length == 0) {
      this.catalogList.forEach((cat) => {
        if(this.filteredClassificationList.indexOf(cat.classification) > -1) {
          this.filteredCatalogList.push(cat);
        }
      })
    } else if(this.filteredClassificationList.length == 0 && this.selectedAdditionalCategories.length != 0) {
      this.catalogList.forEach((cat) => {
        this.selectedAdditionalCategories.forEach((alt) => {
          if(cat.alternateCategory.includes(alt)){
            this.filteredCatalogList.push(cat);
          }
        })
      })
    } else if(this.filteredClassificationList.length != 0 && this.selectedAdditionalCategories.length != 0) {
      this.catalogList.forEach((cat) => {
        if(this.filteredClassificationList.indexOf(cat.classification) > -1) {
          this.filteredCatalogList.push(cat);
        }
      })
      this.catalogList.forEach((cat) => {
        this.selectedAdditionalCategories.forEach((alt) => {
          if(cat.alternateCategory.includes(alt) && this.filteredCatalogList.indexOf(cat) == -1){
            this.filteredCatalogList.push(cat);
          }
        })
      })
    } else {
      this.filteredCatalogList = this.catalogList;
    }
  }

  uploadPage() {
    this.uploadPageOpenBool = !this.uploadPageOpenBool;
  }

  loginAccess() {
    this.loginPageOpenBool = !this.loginPageOpenBool;
  }
}
