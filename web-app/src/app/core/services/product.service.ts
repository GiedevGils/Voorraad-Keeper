import { Injectable } from '@angular/core';
import { Category } from '@core/models/category.model';
import { CookieService } from 'ngx-cookie-service';

import { of, Observable, empty } from 'rxjs';
import { Unit } from '@core/enums/units.enum';
import { HttpClient } from '@angular/common/http';


const categoryCookieName = 'categories';
const lastModifiedCookieName = 'lastModified';
const webUrl = 'http://localhost:3000';

@Injectable({
	providedIn: 'root'
})
export class ProductService {

	constructor(
		private cookies: CookieService,
		private http: HttpClient
	) { }

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
	public getCategories(source?: number): Observable<any> {
		
		// 0 is from web
		if (source == 0 || source == null ) {
			return this.http.get(webUrl + '/data');
		}

		// 1 is from cookies
		else if (source == 1) {
			return this.retrieveCookie(categoryCookieName);
		}
		
		
	}

	// Post
	public saveProduct( categories: Category[] ): void {
		this.categories = categories;
		this.save(categoryCookieName, lastModifiedCookieName);
	}



	private save(catCookieName: string, lastModifiedCookieName: string): void {
		// currentTime is set on the server as the request goes through, but that's not a big issue
		// It means that the server is always up to date, and will be preferred
		let currentTime = JSON.stringify( new Date().getTime() );
		console.log(currentTime);

		this.cookies.set( catCookieName, JSON.stringify(this.categories) );
		this.cookies.set( lastModifiedCookieName, currentTime );

		this.http.post(webUrl + '/save', {lastModified: currentTime, categories: this.categories} ).subscribe();
	}

	public retrieveCookie(cookieName: string): Observable<any> {

		if ( !this.cookies.check(cookieName) ) {
			return of(null);
		}
		
		return of( JSON.parse( this.cookies.get(cookieName) ) )
	}


}
