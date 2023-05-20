import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  productForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.formBuilder.group({
      name: [data?.product && data?.product?.name, Validators.required],
      price: [data?.product && data?.product?.price, Validators.required],
      description: [data?.product && data?.product?.description],
      type: [data?.type ? data?.type : 'delete'],
      id: [data?.product && data?.product?._id],
    });
  }

  onDelete() {
    this.productForm.patchValue({
      type: 'delete',
    });

    this.dialogRef.close(this.productForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
