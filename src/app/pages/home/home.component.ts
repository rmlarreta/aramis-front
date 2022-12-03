import { Component } from '@angular/core';
import { User } from 'src/app/security/model/user.interface'; 
import { AuthenticationService } from 'src/app/service/security/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent{

  user?: User | null;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe(x => this.user = x);
  } 

}

