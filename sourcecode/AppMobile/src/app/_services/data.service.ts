/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataService {
  data: string;

  setData(data) {
    this.data = data;
  }

  getData(){
    return this.data;
  }
}
