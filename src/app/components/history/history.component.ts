import { Component, OnInit } from '@angular/core';
import { CartType, Coffee, HistoryData, Topping, User } from 'src/app/dataType';
import { FirebaseService } from 'src/app/services/firebase.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  public user?: User;
  public coffees?: Coffee[];
  public toppings?: Topping[];
  public cart?: CartType;
  public history?: firebase.firestore.DocumentData[] = [];
  public historyData?: HistoryData[] = [];

  constructor(private fb: FirebaseService) {
  }

  ngOnInit(): void {
    this.getCoffees()
    this.getUser()
    this.getCart()
    this.getToppings()
    this.getHistory()
  }

  getUser(): void {
    this.fb.userSubject.subscribe(user =>
      this.user = user!
    )
  }
  getCoffees(): void {
    this.fb.coffeeSubject.subscribe(coffees =>
      this.coffees = coffees!
    )
  }
  getToppings(): void {
    this.fb.toppingSubject.subscribe(toppings =>
      this.toppings = toppings!
    )
  }
  getCart(): void {
    this.fb.cartSubject.subscribe(cart =>
      this.cart = cart!
    )
  }
  async getHistory() {
    await firebase
      .firestore()
      .collection(`users/${this.user!.uid}/carts`)
      .get().then(snapshot => {
        snapshot.forEach(doc => {
          if (doc.data()['status'] !== 0) {
            this.history!.push(doc.data())
          }
        })
      })
    this.setCafe()
  }

  setCafe() {
    this.history!.forEach((cart: any) => {
      let totalPrice = 0
      let coffeeName: string[] = []
      cart.cartItemList.forEach((cafe: any) => {
        totalPrice += cafe.total
        for (let i = 0; i < this.coffees!.length; i++) {
          if (this.coffees![i].id === cafe.id) {
            coffeeName.push(this.coffees![i].name!)
          }
        }
      })
      this.historyData!.push({ price: totalPrice, coffee: coffeeName, orderDate: cart.orderDate })
      totalPrice = 0
      coffeeName = []
    })
    this.historyData!.sort((a, b) => {
      return Number(new Date(b.orderDate)) - Number(new Date(a.orderDate))
    })
    console.log(this.historyData);
  }

}