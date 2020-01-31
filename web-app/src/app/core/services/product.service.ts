import { Injectable } from '@angular/core';
import { Product } from '@core/models/product.model';
import { Category } from '@core/models/category.model';
import { CookieService } from 'ngx-cookie-service';

import { of, Observable, VirtualTimeScheduler } from 'rxjs';
import { Unit } from '@core/enums/units.enum';


const categoryCookieName = 'categories';
const lastModifiedCookieName = 'lastModified';

@Injectable({
	providedIn: 'root'
})
export class ProductService {

	constructor(private cookies: CookieService) { }

	categories: Category[] = [
		{name: "Kelder", products: [
			{name: "Pasta", numberOfThisProductStored: 1, amountOfUnit: 250, unit: Unit.gr},
			{name: "Kippensoep", numberOfThisProductStored: 1, amountOfUnit: 1, unit: Unit.L}
		]} 
	];

	// Get
	public getCategories(): Observable<Category[]> {
		return this.retrieve(categoryCookieName);
	}

	// Post
	public saveProduct(category: Category, product: Product): void {
		this.categories.find(cat => cat.name == category.name).products.push(product);
		this.save(categoryCookieName, lastModifiedCookieName);
	}



	private save(catCookieName: string, lastModifiedCookieName: string): void {
		this.cookies.set( catCookieName, JSON.stringify(this.categories).trim() );
		this.cookies.set( lastModifiedCookieName, Date.now().toString().trim() );
	}

	private retrieve(cookieName: string): Observable<Category[]> {

		if ( !this.cookies.check(cookieName) ) {
			this.save(cookieName, lastModifiedCookieName);
		}
		
		return of( JSON.parse( this.cookies.get(cookieName) ) )
	}


}
