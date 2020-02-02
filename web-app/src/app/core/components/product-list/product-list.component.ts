import { Component, OnInit } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { Category } from '@core/models/category.model';
import { Unit } from '@core/enums/units.enum'

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

	categories: Category[];

	constructor(private productService: ProductService) { }

	ngOnInit() {
		this.getCategories();
	}

	getCategories() {
		this.productService.getCategories().subscribe((data) => this.categories = data);
	}

	save() {
		this.productService.saveProduct(this.categories[0], this.categories[0].products[0]);
	}

}
