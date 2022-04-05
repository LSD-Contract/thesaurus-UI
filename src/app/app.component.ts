import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Catalog } from './Models/Catalog';
import { DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Thesaurus of Wit and Humor';
  bookTitle = 'The Ultimate Book of Reference';
  categoryList = [];
  filteredCategoryList = [];
  catalogList: Array<Catalog> = [];
  columnsToDisplay = ["name","type","link","author","citation","classification"];
  selectedCategory:number = -1;
  searchControl: FormControl;
  constructor(private http:HttpClient, private sanitizer:DomSanitizer) {
    this.loadCategories();
    this.searchControl = new FormControl();
    this.searchControl.valueChanges.subscribe(newSearch => {
      this.categoryList.forEach(category => {
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

  loadCatalogForCategory(categoryId :string) {
    console.log("click registered "+categoryId);
    this.http.get("http://localhost:9561/thesaurus/crud/getAllWithPagination?entityName=Catalogue&fieldName=categoryId&valueToMatch="+categoryId).subscribe((response:any)=>{
      console.log(response);
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
            }
          })
        })

      }
    })

  }

}

function item(item: any, arg1: (any: any) => boolean): never[] {
  throw new Error('Function not implemented.');
}

