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

  public addItem(item: ItemModel) {
    const items = this.items$.getValue();
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

  public getTotalCartPrice$() {
    return this.totalCartPrice$.asObservable();
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
