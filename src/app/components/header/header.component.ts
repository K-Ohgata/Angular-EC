import { Component, OnInit } from '@angular/core';
import { CartType, User } from '../../dataType';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public user?: User;
  public cart?: CartType;

  constructor(private fb: FirebaseService) { }

  ngOnInit() {
    this.getUser()
    this.getCart()
  }

  login() {
    this.fb.login();
  }
  logout() {
    this.fb.logout();
  }
  getUser(): void {
    this.fb.userSubject.subscribe(user =>
      this.user = user!
    )
  }
  getCart(): void {
    this.fb.cartSubject.subscribe(cart =>
      this.cart = cart!
    )
  }
}
