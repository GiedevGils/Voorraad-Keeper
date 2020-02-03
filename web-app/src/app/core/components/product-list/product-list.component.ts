import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ProductService } from '@core/services/product.service';
import { Category } from '@core/models/category.model';
import { Unit } from '@core/enums/units.enum';
import { MatTable } from '@angular/material';

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

	categories: Category[];
	unitEnum = Unit;
	units = [];
	columnsToDisplay = ['name', 'numberOfThisProductStored', 'amountOfUnit', 'delete'];

	@ViewChildren('table') tables: QueryList<MatTable<any>>;

	constructor(
		private productService: ProductService,
		private toastrService: ToastrService) { }

	ngOnInit() {
		this.getCategories();
		this.units = Object.values(this.unitEnum);
	}

	getCategories() {
		this.productService.getCategories().subscribe((data) => this.categories = data);
	}

	trackByIndex(index: number, obj: any): any {
		return index;
	}

	delete(category: Category, productIndex: number) {
		let catIndex = this.categories.indexOf(category);
		this.categories[catIndex].products.splice(productIndex, 1);
		this.save();
		this.rerender();
	}

	save() {
		this.productService.saveProduct( this.categories );

		this.toastrService.info('Gegevens zijn opgeslagen', '', {
			timeOut: 3000,
			progressBar: true,
			closeButton: true
		})
	}

	rerender() {
		this.tables.forEach(table => {
			table.renderRows();
		})
	}

}
