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
  product: ItemModel;
  selectedImage: File | null = null;
  form: FormGroup;
  modalTitle = 'Add Item';
  shownPrice: number | null;
  shownInventory: number | null;

  englishPattern = /^(?!^\s*$)[a-zA-Z\s]+$/;
  numberPattern = /^[0-9]+$/;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: ItemModel,
    public dialogRef: MatDialogRef<AddItemModalComponent>
  ) {
    this.product = data;

    if (this.product.id !== '') {
      this.modalTitle = 'Edit Item';
      this.shownPrice = this.product.price;
      this.shownInventory = this.product.amountInStock;
    } else {
      this.shownPrice = null;
      this.shownInventory = null;
    }

    this.form = this.createFormValidations();
  }

  createFormValidations(): FormGroup {
    return this.fb.group({
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

    if (this.product.id === '') {
      this.product.id = uuidv4();
    }

    this.product.name = this.product.name.trim();
    this.product.servingSize = this.product.servingSize.trim();
    this.product.price = this.shownPrice || 0;
    this.product.amountInStock = this.shownInventory || 0;

    this.productsService.addItem(this.product);
    this.closeModal();
  }

  onImageSelected(event: any) {
    const selectedFile: File = event.target.files[0];
    this.selectedImage = selectedFile;

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => (this.product.photo = e.target?.result);
      reader.readAsDataURL(selectedFile);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
