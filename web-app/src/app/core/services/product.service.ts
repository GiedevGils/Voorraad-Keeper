import { Injectable } from '@angular/core';
import { Category } from '@core/models/category.model';
import { CookieService } from 'ngx-cookie-service';

import { of, Observable, empty } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
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
		{
			name: "Kelder", products: [
				{ name: "Pasta", numberOfThisProductStored: 1, amountOfUnit: 250, unit: Unit.gr },
				{ name: "Kippensoep", numberOfThisProductStored: 1, amountOfUnit: 1, unit: Unit.L }
			]
		},
		{
			name: "Koelkast", products: [
				{ name: "Cola", numberOfThisProductStored: 2, amountOfUnit: 2, unit: Unit.L },
				{ name: "Mona Toetje", numberOfThisProductStored: 1, amountOfUnit: 2, unit: Unit.pak }
			]
		}
	];

	// Get
	public getCategories(): Observable<Category[]> {
		let lastModifiedCookie: string;
		let categoryCookie;

		return this.http.get(webUrl + '/data', { observe: 'response' })
			.pipe(
				map((response) => {
					let body = response.body;


					this.retrieveCookie(lastModifiedCookieName).subscribe((cookie) => lastModifiedCookie = cookie);
					this.retrieveCookie(categoryCookieName).subscribe((cookie) => categoryCookie = cookie);

					// And the server is more up to date than the cookie
					if (body['lastModified'] >= lastModifiedCookie) {
						// Return the server
						console.log("Server data was more recent. Server data loaded.");
						return body['data'];
					} else {
						// Else, return the cookie
						console.log("Cookie was more recent. Cookie loaded.");
						this.categories = categoryCookie;
						this.save(categoryCookieName, lastModifiedCookieName);
						return categoryCookie;
					}
				}),
				catchError(this.handleError<Category[]>())
			)
	}

	// I wanted to make this better, but I couldn't find a way to return the cookie in the 
	private handleError<T>(source?: number, result?: T) {
		return (): Observable<T> => {

			let item;
			
			if (source == 0 || source == null) {
				console.warn("Server could not be reached. Using cookie instead.");

				let categoryCookie;
				this.retrieveCookie(categoryCookieName).subscribe((cookie) => item = cookie);
			}

			if (source == 1) {
				console.warn("No connection could be made with the server. Only used cookies to save progress.")
			}

			return of(item as T);
		};
	}

	public saveProduct(categories: Category[]): void {
		this.categories = categories;
		this.save(categoryCookieName, lastModifiedCookieName);
	}

	// Post
	private save(catCookieName: string, lastModifiedCookieName: string): void {
		let currentTime = JSON.stringify(new Date().getTime());

		this.cookies.set(catCookieName, JSON.stringify(this.categories));
		this.cookies.set(lastModifiedCookieName, currentTime);

		this.http.post(webUrl + '/save', { lastModified: currentTime, categories: this.categories }).pipe(
			catchError(this.handleError<void>(1) )
		).subscribe();
	}

	public retrieveCookie(cookieName: string): Observable<any> {

		if (!this.cookies.check(cookieName)) {
			return of(null);
		}

		return of(JSON.parse(this.cookies.get(cookieName)))
	}


}
