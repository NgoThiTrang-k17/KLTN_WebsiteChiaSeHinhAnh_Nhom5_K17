import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserServiceService } from 'src/app/_services/user-service.service';
import { User } from 'src/app/model/user'

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  registerationForm: FormGroup;
  user: User;
  userSubmitted: boolean;
  constructor(private fb: FormBuilder, private userService: UserServiceService) { }

  ngOnInit() {
    // this.registerationForm = new FormGroup({
    //   email: new FormControl(null, [Validators.required, Validators.email]),
    //   password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    // });
    this.creatRegisterationForm();
  }

  creatRegisterationForm(){
    this.registerationForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]]  
    })
  }
  // passwordMatchingValidatior(fg: FormGroup): Validators {
  //   return fg.get('password').value === fg.get('confirmPassword').value ? null :
  //   {notmatched: true};
  // }

  get email(){
    return this.registerationForm.get('email') as FormControl;
  }

  get password(){
    return this.registerationForm.get('password') as FormControl;
  }

  onSubmit(){
    console.log(this.registerationForm.value);
    this.userSubmitted = true;
    if(this.registerationForm.valid){
      //this.user = Object.assign(this.user, this.registerationForm.value);
      this.userService.addUser(this.userData());
      this.registerationForm.reset(); 
      this.userSubmitted = false; 
    }
  }

  userData(): User {
    return this.user = {
      email: this.email.value,
      password: this.password.value
    }   
  }

}
