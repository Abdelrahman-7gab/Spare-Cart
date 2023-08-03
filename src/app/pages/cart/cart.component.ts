import { Component } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Observable } from 'rxjs';
import { ItemModel } from 'src/app/interfaces/ItemModel';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  items$: Observable<ItemModel[]>;
  totalPrice$: Observable<number>;
  
  constructor(private productsService: ProductsService) {

    // filter out items that does not exist in the cart

    this.items$ = this.productsService.getItems$().pipe(
      map(items => items.filter(i => i.amountInCart > 0))
    );

    // auto calculate total price when items change

    this.totalPrice$ = this.productsService.getTotalCartPrice$();

  }

  clearCart() {
    this.productsService.clearCart();
  }

}
