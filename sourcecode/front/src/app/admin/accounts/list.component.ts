import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  accounts: Account[] = [];

  changeRole: any;

  maccount = this.accountService.accountValue;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu : [5, 10, 25, 50, 75, 100],
      processing: true,
      language: {
        search: "Tìm kiếm:",
        info: "Đang hiển thị dòng _START_ tới dòng _END_ trong tổng số _TOTAL_ mục",
        emptyTable: "Không có dữ liệu",
        // info: "Hiển thị _START_ tới _END_ của _TOTAL_ dữ liệu",
        infoEmpty: "Hiển thị 0 tới 0 của 0 dữ liệu",
        lengthMenu: "Hiển thị _MENU_ dữ liệu",
        loadingRecords: "Đang tải...",
        paginate: {
          first: "Đầu tiên",
          last: "Cuối cùng",
          next: "Sau",
          previous: "Trước"
        },
      },
    };

    this.accountService.getAll()
    .subscribe(res =>{
      this.accounts = res as Account[];
      this.dtTrigger.next();
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  deleteAccount(id: number) {
    var r = confirm("Are you sure you want to delete this account?");
    if(r)
    {
      try {
        const account = this.accounts.find(x => x.id === id);
        this.accountService.delete(id)
        .pipe(first())
        .subscribe(() => {
          this.accounts = this.accounts.filter(x => x.id !== id);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  updateRole(id: number, role: string){
    console.log(role);

    this.changeRole = {
      role: role
    }
    console.log(this.changeRole);

    this.accountService.update(id, this.changeRole)
    .subscribe(res => {
      console.log(res);
    })
  }
}
