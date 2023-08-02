import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemModel } from 'src/app/interfaces/ItemModel';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  items$: Observable<ItemModel[]>;
  totalPrice$: Observable<number>;
  
  constructor(private productsService: ProductsService) {
    this.items$ = this.productsService.getItems$();
    this.totalPrice$ = this.productsService.getTotalCartPrice$();
  }

}
