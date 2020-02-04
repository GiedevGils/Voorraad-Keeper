import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { ProductListComponent } from '@core/components/product-list/product-list.component';
import { NewProductComponent } from '@core/components/new-product/new-product.component';

// CSS Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material';
import { NewCategoryComponent } from './core/components/new-category/new-category.component';



@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    NewProductComponent,
    NewCategoryComponent
  ],
  imports: [
	BrowserModule,
	BrowserAnimationsModule,
	ToastrModule.forRoot(),
	FormsModule,
	HttpClientModule,

	// CSS imports
	MatToolbarModule,
	MatTableModule,
	MatInputModule,
	MatSelectModule,
	MatButtonModule,
	MatDialogModule
  ],
  providers: [ CookieService ],
  bootstrap: [ AppComponent ],
  entryComponents: [ NewProductComponent, NewCategoryComponent ]
})
export class AppModule { }
