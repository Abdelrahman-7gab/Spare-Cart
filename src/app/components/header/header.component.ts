import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartInfoModel } from 'src/app/interfaces/ItemModel';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartInfo$: Observable<CartInfoModel>;

  constructor(private productsService: ProductsService,private router: Router, private route: ActivatedRoute) {
    this.cartInfo$ = this.productsService.getCartInfo$();
   }

}
