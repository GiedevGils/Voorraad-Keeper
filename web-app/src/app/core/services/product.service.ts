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
		]},
		{name: "Koelkast", products: [
			{name: "Cola", numberOfThisProductStored: 2, amountOfUnit: 2, unit: Unit.L},
			{name: "Mona Toetje", numberOfThisProductStored: 1, amountOfUnit: 2, unit: Unit.pak}
		]} 
	];

	// Get
	public getCategories(): Observable<Category[]> {
		return this.retrieve(categoryCookieName);
	}

	// Post
	public saveProduct( categories: Category[] ): void {
		this.categories = categories;
		this.save(categoryCookieName, lastModifiedCookieName);
		console.log(this.categories);
	}



	private save(catCookieName: string, lastModifiedCookieName: string): void {
		this.cookies.set( catCookieName, JSON.stringify(this.categories) );
		this.cookies.set( lastModifiedCookieName, Date.now().toString() );
	}

	private retrieve(cookieName: string): Observable<Category[]> {

		if ( !this.cookies.check(cookieName) ) {
			this.save(cookieName, lastModifiedCookieName);
		}
		
		return of( JSON.parse( this.cookies.get(cookieName) ) )
	}


}
