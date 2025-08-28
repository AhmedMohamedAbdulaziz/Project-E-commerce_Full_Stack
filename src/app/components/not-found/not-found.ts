import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Userservice } from '../../user/services/user';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  constructor(protected userService: Userservice) {}

  goBack() {
    window.history.back();
  }
}
