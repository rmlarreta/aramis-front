import { Component } from '@angular/core';
import { UserAuth } from 'src/app/model/userAuth.interface'; 
import { AuthenticationService } from 'src/app/service/security/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent{

  user?: UserAuth | null;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe(x => this.user = x);
  } 

}

