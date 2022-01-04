import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartType, Coffee, Topping, User } from 'src/app/dataType';
import { FirebaseService } from 'src/app/services/firebase.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public id: number = 0;
  public select?: Coffee;
  public topping?: Topping[];
  public toppings?: string[]=[];
  public user?: User;
  public cart?: CartType;

  public flag: boolean = false;
  public size: string = '';
  public quantity: string = "1";
  public error: string = '';

  constructor(private route: ActivatedRoute, private fb: FirebaseService) { }

  ngOnInit(): void {
    this.getCoffee()
    this.getTopping()
    this.getUser()
    this.getCart()
  }

  getCoffee(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.fb.coffeeSubject.subscribe((coffees) =>
      this.select = coffees!.find((cafe: Coffee) => cafe.id === id)
    )
  }

  getTopping(): void {
    this.fb.toppingSubject.subscribe(topping =>
      this.topping = topping!
    )
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

  setToppingList(value: any): void {
    if (this.toppings!.includes(value)) {
      this.toppings = this.toppings!.filter(item => item !== value)
    } else {
      this.toppings!.push(value)
    }
  }

  totalPrice() {
    if (this.size === "M") {
      return this.select!.msizePrice! * Number(this.quantity) + this.toppings!.length * 200 * Number(this.quantity)
    } else if (this.size === "L") {
      return this.select!.lsizePrice! * Number(this.quantity) + this.toppings!.length * 300 * Number(this.quantity)
    } else {
      return 0
    }
  }

  setCartItem(): void {
    if (this.user!) {
      firebase.firestore()
        .collection(`users/${this.user.uid}/carts`)
        .doc(this.cart!.id)
        .update({ cartItemList: this.cart!.cartItemList! })
    }
  }


  trueFlag(): void {
    if (this.size === '') {
      this.error = 'サイズを選択して下さい'
    } else {
      const itemInfo = {
        id: Number(this.route.snapshot.paramMap.get('id')),
        quantity: Number(this.quantity),
        total: this.totalPrice(),
        size: this.size,
        topping: this.toppings!,
      }
      this.cart!.cartItemList.push(itemInfo)
      this.setCartItem()
      this.fb.cartSubject.next(this.cart!)
      alert('商品をカートに追加しました')
      this.flag = true
    }
  }
}
