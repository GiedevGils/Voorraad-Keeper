import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ProductService } from '@core/services/product.service';
import { Category } from '@core/models/category.model';
import { Unit } from '@core/enums/units.enum';
import { MatDialog } from '@angular/material';
import { Product } from '@core/models/product.model';
import { NewCategoryComponent } from '../new-category/new-category.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  categories: Category[];
  unitEnum = Unit;
  units = [];
  lastModifiedCookie: string;

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getCategories();

    this.units = Object.values(this.unitEnum);
  }

  getCategories() {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;

      if (!this.categories || this.categories.length === 0) {
        this.toast('Er zijn geen gegevens gevonden. Begin met invullen!');
      }
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  delete(category?: Category, product?: Product) {
    console.log(category)
    if (category && product) {
      const catIndex = this.categories.indexOf(category);
      const productIndex = this.categories[catIndex].products.indexOf(product);
      this.categories[catIndex].products.splice(productIndex, 1);
    } else if (category && !product) {
      const catIndex = this.categories.indexOf(category);
      this.categories.splice(catIndex, 1);
    }

    this.save();
  }

  save() {
    this.productService.saveProduct(this.categories);
    this.toast('Gegevens zijn opgeslagen');
  }

  openNewCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '75%',
      data: { categoryName: '' },
    });

    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      console.log(typeof res);

      if (res) {
        this.categories.push({ name: res, products: [] });
        this.save();
      }
    });
  }

  toast(title: string, content?: string) {
    this.toastrService.info(title, content, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }
}
