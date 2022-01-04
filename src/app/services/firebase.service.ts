import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { User, Coffee, Topping, CartType } from '../dataType';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public userSubject = new BehaviorSubject<User | null>(null);
  public coffeeSubject = new BehaviorSubject<Coffee[] | null>(null);
  public toppingSubject = new BehaviorSubject<Topping[] | null>(null);
  public cartSubject = new BehaviorSubject<CartType | null>(null);

  constructor(private afAuth: AngularFireAuth,private router: Router) { }

  ngOnInit(): void {
    // if (this.userSubject.getValue()) {
    //   this.fetchCart(this.userSubject.getValue()!)
    // } else {
    //   this.setCart()
    // }
    // this.setCoffee()
    // this.setTopping()
  }

  login() {
    this.afAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        this.userSubject.next(result.user);
        this.fetchCart(result.user!)
      });
  }
  logout() {
    this.afAuth.signOut();
    this.userSubject.next(null);
    this.setCart()
  }
  fetchCart = (user: User) => {
    let cartItem: any = {};
    firebase
      .firestore()
      .collection(`users/${user.uid}/carts`)
      .get().then(snapshot => {
        if (snapshot.empty) {
          firebase
            .firestore()
            .collection(`users/${user.uid}/carts`)
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
              cartItemList: [],
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
            })
        }
        snapshot.forEach(doc => {
          if (doc.data()['status'] === 0) {
            let cartData = Object.assign({}, doc.data())
            cartItem = { ...cartData, id: doc.id }
          }
        })
        this.cartSubject.next(cartItem)
      })
  }
  setCart = () => {
    let cartItem: CartType = {
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
    this.cartSubject.next(cartItem)
  }

  setCoffee = () => {
    let coffee: Coffee[] = []
    firebase
      .firestore()
      .collection(`product`)
      .get().then(snapshot => {
        snapshot.forEach(doc => {
          coffee.push(doc.data())
        })
        this.coffeeSubject.next(coffee)
      })
  }
  setTopping = () => {
    let topping: Topping[] = []
    firebase
      .firestore()
      .collection(`topping`)
      .get().then((snapshot) => {
        snapshot.forEach((doc) => {
          topping.push(doc.data())
        })
        this.toppingSubject.next(topping)
      })
  }

}
