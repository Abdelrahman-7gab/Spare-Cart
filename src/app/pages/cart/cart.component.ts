import { Component } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Observable } from 'rxjs';
import { ItemModel } from 'src/app/interfaces/ItemModel';
import { CartInfoModel } from 'src/app/interfaces/ItemModel';
import { map } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  items$: Observable<ItemModel[]>;
  cartInfo$: Observable<CartInfoModel>;
  
  constructor(private productsService: ProductsService) {

    this.cartInfo$ = this.productsService.getCartInfo$();

    // filter out items that does not exist in the cart
    this.items$ = this.productsService.getItems$().pipe(
      map(items => items.filter(item => item.amountInCart > 0))
    );
    

  }

  clearCart() {
    this.productsService.clearCart();
  }

}
