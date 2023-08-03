import { Injectable } from '@angular/core';
import { ItemModel } from '../interfaces/ItemModel';
import { CartInfoModel } from '../interfaces/ItemModel';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private items$: BehaviorSubject<ItemModel[]>;
  private CartInfo$: Observable<CartInfoModel>;
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public getItems$() {
    return this.items$.asObservable();
  }

  public getCartInfo$() {
    return this.CartInfo$;
  }

  public getLoading$() {

    return this.loading.asObservable();

  }

  public updateDataWithDelay(items: ItemModel[]) {
    this.loading.next(true);
    setTimeout(() => {
      this.items$.next(items);
      this.loading.next(false);
    }, 500);
  }

  public addItem(item: ItemModel) {
    const items = this.items$.getValue();
    // check if item id already exists in the list
    if (items.find((i) => i.id === item.id)) {
      this.updateItem(item);
      return;
    }
    items.push(item);
    this.updateDataWithDelay(items);
  }

  public removeItem(item: ItemModel) {
    const items = this.items$.getValue();
    const index = items.findIndex((i) => i.id === item.id);
    items.splice(index, 1);
    this.updateDataWithDelay(items);
  }

  public updateItem(item: ItemModel) {
    const items = this.items$.getValue();
    const index = items.findIndex((i) => i.id === item.id);
    items[index] = item;
    this.updateDataWithDelay(items);
  }

  public addToCart(item: ItemModel) {
    const items = this.items$.getValue();
    const index = items.findIndex((i) => i.id === item.id);
    if (items[index].amountInStock > 0) {
      items[index].amountInStock--;
      items[index].amountInCart++;
      this.updateDataWithDelay(items);
    } else {
      alert('There’s not enough of this item left in stock.');
    }
  }

  public subtractFromCart(item: ItemModel) {
    const items = this.items$.getValue();
    const index = items.findIndex((i) => i.id === item.id);
    if (items[index].amountInCart > 0) {
      items[index].amountInStock++;
      items[index].amountInCart--;
      this.updateDataWithDelay(items);
    }
  }

  public clearCart() {
    const items = this.items$.getValue();
    items.forEach((item) => {
      item.amountInStock = item.amountInStock + item.amountInCart;
      item.amountInCart = 0;
    });
    this.updateDataWithDelay(items);
  }

  CartInfoSubscribtion() {
    // update total price and total items number in cart
    this.CartInfo$ = this.items$.pipe(
      map((items) => {
        const cartSize = items.filter((item) => item.amountInCart > 0).length;
        const totalPrice = items.reduce((acc, item) => {
          return acc + item.amountInCart * item.price;
        }, 0);
        return { cartSize, totalPrice };
      }
      )
    );

  }

  loadFromLocalStorage() {
    const data = localStorage.getItem('items');
    if (data) {
      this.items$.next(JSON.parse(data));
    }
  }

  syncWithLocalStorage() {
    this.items$.subscribe((items) => {
      // check that the data is not already saved in local storage but with a different tab id to avoid an infinite loop
      const localData = localStorage.getItem('items');
      if (localData) {
        const localStorageItems = JSON.parse(localData);
        if (JSON.stringify(localStorageItems) === JSON.stringify(items)) {
          return;
        }
      }

      localStorage.setItem('items', JSON.stringify(items));
    });

    // subscribe to changes in local storage in case of using multiple tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'items' && event.newValue) {
        const items = JSON.parse(event.newValue);
        this.items$.next(items);
      }
    });
  }

  constructor() {
    this.items$ = new BehaviorSubject<ItemModel[]>([]);
    this.CartInfo$ = new Observable<CartInfoModel>();

    // update total price when items change
    this.CartInfoSubscribtion();
    // load items from local storage
    this.loadFromLocalStorage();
    // any changes to items will be saved to local storage and changes in other tabs will be synced
    this.syncWithLocalStorage();
  }
}
