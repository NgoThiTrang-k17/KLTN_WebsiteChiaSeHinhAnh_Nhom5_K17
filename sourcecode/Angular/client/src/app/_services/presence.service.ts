import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor(private toastr: ToastrService) { }

  createHubConnection(Account: Account) {
    this.hubConnection = new HubConnectionBuilder
  }
}
