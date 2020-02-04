import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Product } from '@core/models/product.model';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

	categoryName: string;

	constructor(
		public dialogRef: MatDialogRef<NewCategoryComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {}

	ngOnInit() {
		this.categoryName = this.data.categoryName;
	}
	
	onNoClick(): void {
		this.dialogRef.close();
	}

}
