import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Product } from '@core/models/product.model';
import { Category } from '@core/models/category.model';

@Component({
	selector: 'app-new-product',
	templateUrl: './new-product.component.html',
	styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

	product: Product;
	category: Category;
	units: [];

	constructor(
		public dialogRef: MatDialogRef<NewProductComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {}

	ngOnInit() {
		this.category = this.data.category;
		this.units = this.data.units;
		this.product = new Product();
	}
	
	onNoClick(): void {
		this.dialogRef.close();
	}

}
