import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemModel } from 'src/app/interfaces/ItemModel';
import { CartInfoModel } from 'src/app/interfaces/ItemModel';
import { ProductsService } from 'src/app/services/products.service';
import { AddItemModalComponent } from 'src/app/components/add-item-modal/add-item-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  items$: Observable<ItemModel[]>;
  cartInfo$: Observable<CartInfoModel>;
  
  constructor(private productsService: ProductsService, public dialog: MatDialog) {
    this.items$ = this.productsService.getItems$();
    this.cartInfo$ = this.productsService.getCartInfo$();
  }

  openAddItemModal(item: ItemModel | null) {
    if (!item) {
      item = {
        id: '',
        name: '',
        photo: null,
        price: 0,
        servingSize: '',
        amountInStock: 0,
        amountInCart: 0
      };
    }

    const dialogRef = this.dialog.open(AddItemModalComponent, {
      width: '332px',
      data: item,
      maxHeight: '80vh'
    });
  }

}
