import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  //templateUrl: './register.component.html',
  template : `
     <div>{{parentCount}}</div>
  `,
  styleUrls: ['./register.component.css'],
  inputs: [`parentCount`]
})
export class RegisterComponent implements OnInit {

parentCount: number;

 registerForm: FormGroup;
 submitted = false;
detailForm : any;



    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
         this.submitted = true;

      // stop here if form is invalid
        if (this.registerForm.invalid) {
             return;
         }

        // alert('SUCCESS!! :-)\n\n');
        
        //   console.log(this.registerForm.value);
          this.detailForm = JSON.stringify(this.registerForm.value);
    }
}
