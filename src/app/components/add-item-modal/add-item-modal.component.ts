import { Component, Inject } from '@angular/core';
import { ItemModel } from 'src/app/interfaces/ItemModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.scss'],
})
export class AddItemModalComponent {
  productName: string;
  price: number;
  servingSize: string;
  amountInStock: number;
  amountInCart: number;
  photo: string | ArrayBuffer | null;
  id: string;

  form: FormGroup;
  modalTitle = 'Add Item';

  englishPattern = /^[a-zA-Z]+$/;
  numberPattern = /^[0-9]+$/;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: ItemModel,
    public dialogRef: MatDialogRef<AddItemModalComponent>
  ) {
    this.productName = data.name;
    this.price = data.price;
    this.servingSize = data.servingSize;
    this.amountInStock = data.amountInStock;
    this.amountInCart = data.amountInCart;
    this.photo = data.photo;
    this.id = data.id;

    if (this.id !== '') {
      this.modalTitle = 'Edit Item';
    }

    this.form = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(this.englishPattern)],
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.pattern(this.numberPattern),
          Validators.min(0),
        ],
      ],
      servingSize: [''],
      inventory: [
        '',
        [
          Validators.required,
          Validators.pattern(this.numberPattern),
          Validators.min(0),
        ],
      ],
      // Add more form controls as needed...
    });
  }

  addItem() {
    if (this.form.invalid) {
      return;
    }

    if (this.id === '') {
      this.id = uuidv4();
    }
    const item: ItemModel = {
      name: this.productName,
      price: this.price,
      servingSize: this.servingSize,
      amountInStock: this.amountInStock,
      amountInCart: this.amountInCart,
      photo: this.photo,
      id: this.id,
    };
    this.productsService.addItem(item);
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

}
