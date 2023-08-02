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
  price: number | null;
  servingSize: string;
  amountInStock: number | null;
  amountInCart: number;
  selectedImage: File | null = null;
  photo: string | ArrayBuffer | null | undefined;
  id: string;

  form: FormGroup;
  modalTitle = 'Add Item';

  englishPattern = /^(?!^\s*$)[a-zA-Z\s]+$/;
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
    else{
      this.amountInStock = null;
      this.price = null;
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
  saveItem() {
    if (this.form.invalid) {
      return;
    }

    if (this.id === '') {
      this.id = uuidv4();
    }

    const item: ItemModel = {
      name: this.productName.trim(),
      price: this.price || 0,
      servingSize: this.servingSize.trim(),
      amountInStock: this.amountInStock || 0,
      amountInCart: this.amountInCart,
      photo: this.photo,
      id: this.id,
    };
    this.productsService.addItem(item);
    this.closeModal();
  }

  onImageSelected(event: any) {
    const selectedFile: File = event.target.files[0];
    this.selectedImage = selectedFile;

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => this.photo = e.target?.result;
      reader.readAsDataURL(selectedFile);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

}
