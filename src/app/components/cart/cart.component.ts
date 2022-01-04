import { Component, OnInit } from '@angular/core';
import { CartType, Coffee, Topping, User, MyCart, CartInfo } from 'src/app/dataType';
import { FirebaseService } from 'src/app/services/firebase.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public user?: User;
  public coffees?: Coffee[];
  public toppings?: Topping[];
  public cart?: CartType;
  public myCart?: MyCart[] = [];
  public cartItem?: CartInfo[] = [];
  public choiceCoffee?: Coffee[] = [];

  constructor(private fb: FirebaseService) {
  }

  ngOnInit(): void {
    this.getCoffees()
    this.getUser()
    this.getCart()
    this.getToppings()
    this.getInfo()
  }

  getUser(): void {
    this.fb.userSubject.subscribe(user =>
      this.user = user!
    )
  }
  getCoffees(): void {
    this.fb.coffeeSubject.subscribe(coffee =>
      this.coffees = coffee!
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
  getInfo(): void {
    if (this.cart!) {
      for (let i = 0; i < this.coffees!.length; i++) {
        for (let j = 0; j < this.cart.cartItemList.length; j++) {
          if (this.coffees![i].id === this.cart.cartItemList[j].id) {
            this.myCart!.push({
              coffee: this.coffees![i],
              cart: this.cart.cartItemList[j]
            })
            this.choiceCoffee!.push(this.coffees![i])
            this.cartItem!.push(this.cart.cartItemList[j])
          }
        }
      }
    }
  }

  login() {
    this.fb.login();
  }
  deleteCart(): void {
    if (this.user) {
      firebase.firestore()
        .collection(`users/${this.user.uid}/carts`)
        .doc(this.cart!.id)
        .update({ cartItemList: this.cartItem })
    }
  }

  delItem(index: number): void {
    this.myCart!.splice(index, 1)
    this.cart!.cartItemList.splice(index, 1)
    this.cartItem!.splice(index, 1)
    this.choiceCoffee!.splice(index, 1)
    // dispatch(deleteItem(carts))
    this.deleteCart()
  }

  culcTax() {
    let totalTax = 0
    this.cartItem!.forEach((item) => {
      totalTax += item.total
    })
    totalTax = totalTax * 0.1
    return totalTax
  }

  culcPrice () {
    let totalPrice = 0
    this.cartItem!.forEach((item) => {
      totalPrice += item.total
    })
    totalPrice = totalPrice + totalPrice * 0.1
    return totalPrice
  }

}
