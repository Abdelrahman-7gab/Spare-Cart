import { Component } from '@angular/core';
import { Input,Output,EventEmitter} from '@angular/core';
import { ItemModel } from 'src/app/interfaces/ItemModel';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() item!: ItemModel;
  @Output() editItem = new EventEmitter<ItemModel>();

  constructor(private productsService: ProductsService) { }


  addToCart() {
    this.productsService.addToCart(this.item);
  }

  subtractFromCart() {
    this.productsService.subtractFromCart(this.item);
  }

  editItemClicked() {
    this.editItem.emit(this.item);
  }


}
