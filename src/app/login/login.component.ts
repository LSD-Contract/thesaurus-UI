import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private http:HttpClient) { }
  loginFormGroup!: FormGroup;
  errorMsg = "";

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      username: new FormControl("",[Validators.required]),
      password: new FormControl("",[Validators.required])
   });
   this.errorMsg = "";
  }

  onLogin(result: any) {
    this.errorMsg = "";
    if(result.username != null && result.username != "" && result.password != null && result.password != "" ) {
      this.http.get("http://localhost:9561/thesaurus/business/credentials?username="+result.username+"&password="+result.password).subscribe((response:any)=>{
        if(response != null && response["status"] == "OK") {
          this.router.navigate(['/admin']);
        } else if(response != null && response["status"] == "EXPECTATION_FAILED") {
          this.errorMsg = response["message"];
        }
      })
    }
  }

}
