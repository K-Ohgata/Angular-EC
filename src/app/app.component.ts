import { Component } from '@angular/core';
import { User } from './dataType';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-ec';
  public user?:User;

  constructor(private fb: FirebaseService) {}

  ngOnInit(): void {
    this.fb.setCoffee()
    this.fb.setTopping()
  }
}
