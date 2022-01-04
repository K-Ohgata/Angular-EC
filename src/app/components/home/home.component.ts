import { Component, OnInit } from '@angular/core';
import { Coffee } from 'src/app/dataType';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public fetchCoffee?: Coffee[];
  public coffee?: Coffee[];
  public keyword: string = "";

  constructor(private fb: FirebaseService) {
  }

  ngOnInit(): void {
    this.getCoffees()
  }

  getCoffees(): void {
    this.fb.coffeeSubject.subscribe(coffees =>
      this.fetchCoffee = coffees!
    )
  }

  searchCoffee(): void {
    let search: Coffee[] = [];
    this.fetchCoffee!.forEach((item) => {
      if (item.name!.indexOf(this.keyword) > -1) {
        search.push(item)
      }
    })
    if (this.keyword === '') {
      alert('キーワードを入力してください')
    } else if (search.length === 0) {
      alert('該当する商品はありません')
      this.coffee = this.fetchCoffee
      this.keyword = ""
    } else {
      this.coffee = search
    }
  }

  clear(): void {
    this.keyword = ""
    this.coffee = this.fetchCoffee
  }

  highSort(): void {
    if (!this.coffee) {
      const sortFetchCoffee = this.fetchCoffee!.slice()
      sortFetchCoffee.sort((a, b) => {
        return b.msizePrice! - a.msizePrice!
      })
      this.coffee = sortFetchCoffee
    } else {
      const sortFetchCoffee = this.coffee!.slice()
      sortFetchCoffee.sort((a, b) => {
        return b.msizePrice! - a.msizePrice!
      })
      this.coffee = sortFetchCoffee
    }
  }

  lowSort(): void {
    if (!this.coffee) {
      const sortFetchCoffee = this.fetchCoffee!.slice()
      sortFetchCoffee.sort((a, b) => {
        return a.msizePrice! - b.msizePrice!
      })
      this.coffee = sortFetchCoffee
    } else {
      const sortFetchCoffee = this.coffee!.slice()
      sortFetchCoffee.sort((a, b) => {
        return a.msizePrice! - b.msizePrice!
      })
      this.coffee = sortFetchCoffee
    }
  }
}
