import { Injectable } from '@angular/core';
import { ItemModel } from '../interfaces/ItemModel';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  private items$: BehaviorSubject<ItemModel[]>;
  private totalCartPrice$: BehaviorSubject<number>;
  
  public getItems$() {
    return this.items$.asObservable();
  }
  
  public getTotalCartPrice$() {
    return this.totalCartPrice$.asObservable();
  }

  public addItem(item: ItemModel) {
    console.log(item);
    const items = this.items$.getValue();
    // check if item id already exists in the list 
    if (items.find(i => i.id === item.id)) {
      this.updateItem(item);
      return;
    }
    items.push(item);
    this.items$.next(items);
  }
  
  public removeItem(item: ItemModel) {
    const items = this.items$.getValue();
    const index = items.findIndex(i => i.id === item.id);
    items.splice(index, 1);
    this.items$.next(items);
  }

  public updateItem(item: ItemModel) {

    const items = this.items$.getValue();
    const index = items.findIndex(i => i.id === item.id);
    items[index] = item;
    this.items$.next(items);
  }

  public addToCart(item: ItemModel) {
    const items = this.items$.getValue();
    const index = items.findIndex(i => i.id === item.id);
    if(items[index].amountInStock > 0){
      items[index].amountInStock--;
      items[index].amountInCart++;
      this.items$.next(items);
    }
    else{
      alert("There’s not enough of this item left.");
    }
  }

  public removeFromCart(item: ItemModel) {
    const items = this.items$.getValue();
    const index = items.findIndex(i => i.id === item.id);
    if(items[index].amountInCart > 0){
      items[index].amountInStock = items[index].amountInStock + items[index].amountInCart;
      items[index].amountInCart = 0;
      this.items$.next(items);
    }
  }

  public clearCart() {
    const items = this.items$.getValue();
    items.forEach(item => {
      item.amountInStock = item.amountInStock + item.amountInCart;
      item.amountInCart = 0;
    });
    this.items$.next(items);
  }

  constructor() {

    this.items$ = new BehaviorSubject<ItemModel[]>([]);
    this.totalCartPrice$ = new BehaviorSubject<number>(0);

    // update total price when items change

    this.items$.subscribe(items => {
      const totalPrice = items.reduce((acc, item) => acc + item.price * item.amountInCart, 0);
      this.totalCartPrice$.next(totalPrice);
    }
    );

   }

   
}
