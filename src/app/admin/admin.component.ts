import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  buttonClicked(componentName:string) {
      if(componentName != null) {
        this.router.navigate(['/'+componentName]);
      }
  }

}
