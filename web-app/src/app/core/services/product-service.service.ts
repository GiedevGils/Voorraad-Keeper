import { Injectable } from '@angular/core';
import { Product } from '@core/models/product.model';
import { Category } from '@core/models/category.model';
import { CookieService } from 'ngx-cookie-service';

import { pipe } from 'rxjs'


const categoryCookieName = 'categories';

@Injectable({
	providedIn: 'root'
})
export class ProductServiceService {

	constructor(private cookies: CookieService) { }

	categories: Category[];

	saveProduct(category: Category, product: Product) {
		this.categories.find(cat => cat.name == category.name).products.push(product);
		this.save();
	}



	save(): void {
		this.cookies.set(categoryCookieName, JSON.stringify(this.categories))
	}


}
