import { Component, OnInit } from '@angular/core';
import { CartInfo, CartType, Coffee, Error, MyCart, Topping, User } from 'src/app/dataType';
import { FirebaseService } from 'src/app/services/firebase.service';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {
  public user?: User;
  public coffees?: Coffee[];
  public toppings?: Topping[];
  public cart?: CartType;
  public myCart?: MyCart[] = [];
  public cartItem?: CartInfo[] = [];
  public choiceCoffee?: Coffee[] = [];
  public errorText?: Error = {
    name: "",
    email: "",
    addressnum: "",
    address: "",
    tel: "",
    date: "",
    time: "",
    status: "",
  };

  constructor(private fb: FirebaseService, private router: Router) {
  }

  ngOnInit(): void {
    this.getCoffees()
    this.getUser()
    this.getCart()
    this.getToppings()
    this.getInfo()
    console.log(this.errorText);
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

    const orderdate = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
    this.cart!.orderDate = orderdate
  }

  culcTax() {
    let totalTax = 0
    this.cartItem!.forEach((item) => {
      totalTax += item.total
    })
    totalTax = totalTax * 0.1
    return totalTax
  }

  culcPrice() {
    let totalPrice = 0
    this.cartItem!.forEach((item) => {
      totalPrice += item.total
    })
    totalPrice = totalPrice + totalPrice * 0.1
    return totalPrice
  }

  updateCart() {
    firebase.firestore()
      .collection(`users/${this.user!.uid}/carts`)
      .doc(this.cart!.id)
      .update(this.cart!)
  }

  addCart() {
    let cartItem: CartType;
    firebase
      .firestore()
      .collection(`users/${this.user!.uid}/carts`)
      .add({
        orderDate: "",
        userName: "",
        mailAddress: "",
        addressNumber: "",
        address: "",
        phoneNumber: "",
        deliveryDate: "",
        deliveryTime: "",
        status: 0,
        cartItemList: []
      }).then(doc => {
        cartItem = {
          id: doc.id,
          orderDate: "",
          userName: "",
          mailAddress: "",
          addressNumber: "",
          address: "",
          phoneNumber: "",
          deliveryDate: "",
          deliveryTime: "",
          status: 0,
          cartItemList: [],
        }
        // dispatch(fetchCartItem(cartItem))
        this.fb.cartSubject.next(cartItem)
      })
  }

  validation() {
    let errors = Object.assign({}, this.errorText)
    const mail = (/^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9_-]+[a-zA-Z0-9._-]+$/)
    const addressnum = (/^[0-9]{3}-[0-9]{4}$/)
    const tel = (/^[0-9]{3}-[0-9]{4}-[0-9]{4}$/)

    const today = new Date().getFullYear() * 10000 + (new Date().getMonth() + 1) * 100 + new Date().getDate()
    const selectDay = new Date(this.cart!.deliveryDate).getFullYear() * 10000 + (new Date(this.cart!.deliveryDate).getMonth() + 1) * 100 + new Date(this.cart!.deliveryDate).getDate()
    const hour = new Date().getHours()


    if (this.cart!.userName === '') {
      errors.name = 'お名前を入力してください'
    } else {
      delete errors.name
    }

    if (this.cart!.mailAddress === '') {
      errors.email = 'メールアドレスを入力してください'
    } else {
      if (mail.test(this.cart!.mailAddress)) {
        delete errors.email
      } else {
        // setthis.cart!({ ...this.cart!, mailAddress: '' })
        this.cart!.mailAddress = ''
        errors.email = 'メールアドレスの形式が不正です'
      }
    }

    if (this.cart!.addressNumber === '') {
      errors.addressnum = '郵便番号を入力してください'
    } else {
      if (addressnum.test(this.cart!.addressNumber)) {
        delete errors.addressnum
      } else {
        // setthis.cart!({ ...this.cart!, addressNumber: '' })
        this.cart!.addressNumber = ''
        errors.addressnum = '郵便番号はxxx-xxxxの形式で入力してください'
      }
    }

    if (this.cart!.address === '') {
      errors.address = '住所を入力してください'
    } else {
      delete errors.address
    }

    if (this.cart!.phoneNumber === '') {
      errors.tel = '電話番号を入力してください'
    } else {
      if (tel.test(this.cart!.phoneNumber)) {
        delete errors.tel
      } else {
        // setthis.cart!({ ...this.cart!, phoneNumber: '' })
        this.cart!.phoneNumber = ''
        errors.tel = '電話番号はxxx-xxxx-xxxxの形式で入力してください'
      }
    }

    if (this.cart!.deliveryDate === '') {
      errors.date = '配達日時を指定してください'
    } else if (this.cart!.deliveryDate && selectDay < today) {
      errors.date = "今日以降の日付を入力してください"
    } else if (this.cart!.deliveryDate && this.cart!.deliveryTime === '') {
      delete errors.date
      errors.time = '配達時間を指定してください'
    } else if (this.cart!.deliveryDate && selectDay === today) {
      if (this.cart!.deliveryTime === '') {
      } else if (this.cart!.deliveryTime && hour > 18) {
        errors.time = "明日以降の日付を選択してください";
      } else if (this.cart!.deliveryTime && (Number(this.cart!.deliveryTime) < hour + 3)) {
        errors.time = "現在から3時間以降を指定してください";
      }
    } else {
      delete errors.date
      delete errors.time;
    }

    if (this.cart!.status === 0) {
      errors.status = 'どちらか一方をお選びください'
    } else {
      delete errors.status
    }
    // setErrorText(errors)
    this.errorText = errors
    if (Object.keys(errors).length === 0) {
      this.updateCart()
      this.addCart()
      // router.push('/done')
      this.router.navigate(["/done"]);
    }
  }
}