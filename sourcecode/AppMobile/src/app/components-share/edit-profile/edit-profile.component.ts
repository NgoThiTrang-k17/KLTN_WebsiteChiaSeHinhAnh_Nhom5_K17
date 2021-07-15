/* eslint-disable no-trailing-spaces */
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController  } from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { AccountToUpdate } from '../../_models';
import { AccountService } from '../../_services';
import { title } from 'process';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  @ViewChild('updateProfileForm') updateProfileForm: NgForm;
  @Input() accountId: number;

  public title: string;
  public name: string;
  public email: string;
  public password: string;
  public confirmPassword: string;
  public error = '';
  public errorName = '';
  public errorEmail = '';

  accountUpdate: AccountToUpdate;

  maccount = this.accountService.accountValue;

  constructor(
    public modalController: ModalController,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.title = this.maccount.title;
    this.name = this.maccount.name;
    this.email = this.maccount.email;
  }

  closeModalCmt() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  submit(){

    if(this.name === ''){
      this.errorName = 'Vui lòng nhập tên';
      return;
    }
    if(this.email === ''){
      this.errorEmail = 'Vui lòng nhập email';
      return;
    }

    if(this.password === undefined){
      this.password = '';
      this.confirmPassword = '';

      this.accountUpdate = {
        title: this.title,
        name: this.name,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      };

      this.accountService.update(this.maccount.id, this.accountUpdate)
      .subscribe(res => {
        console.log('Thành công');
        this.closeModalCmt();
      }, error => {
        this.errorEmail = 'Email không hợp lệ';
      });
    } else if(this.password !== undefined){
      if(this.confirmPassword === undefined || this.confirmPassword === ''){
        this.error = 'Vui lòng nhập lại mật khẩu';
        return;
      }
      if(this.password !== this.confirmPassword){
        this.error = 'Mật khẩu không khớp';
        return;
      }

      this.accountUpdate = {
        title: this.title,
        name: this.name,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      };

      this.accountService.update(this.maccount.id, this.accountUpdate)
      .subscribe(res => {
        console.log('Thành công');
        this.closeModalCmt();
      }, error => {
        if(error.email){
          this.errorEmail = 'Email không hợp lệ';
        } else if(error.minlength){
          this.error = 'Mật khẩu tối thiểu dài 6 kí tự';
        }
      });
    }

  }
}
