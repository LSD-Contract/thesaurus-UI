import { Credential } from './../Models/Credential';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css']
})
export class CredentialsComponent implements OnInit {

  credentialFormGroup!: FormGroup;
  notification = "";
  credential: Credential = new Credential();

  constructor(private router: Router, private http:HttpClient) { }

  emptyFormCreate() {
    this.credentialFormGroup = new FormGroup({
      credentialName: new FormControl("",[Validators.required]),
      credentialPassword: new FormControl("",[Validators.required])
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
    if(result.credentialName != null && result.credentialName != "" && result.credentialPassword != null && result.credentialPassword != "" ) {
      this.credential.username = result.credentialName;
      this.credential.password = result.credentialPassword;
      this.http.post("http://localhost:9561/thesaurus/business/create/credentials", this.credential).subscribe((response:any)=>{
        if(response != null && response["status"] == "OK") {
          this.notification = "New Credential has been created";
          this.emptyFormCreate();
        } else {
          this.notification = "Username already exists";
          this.emptyFormCreate();
        }
      })
    }
  }


}
