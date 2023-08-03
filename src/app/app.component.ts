import { Component } from '@angular/core';
import { ProductsService } from './services/products.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Shopping-List';
  isLoading$: Observable<boolean>;

  constructor(private productsService: ProductsService) {
    this.isLoading$ = this.productsService.getLoading$();
   }
}
