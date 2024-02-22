import { Component } from '@angular/core';
import { CdkProjectedContent } from '../cdk/content';
import { MatDatepicker } from '../mat/datepicker';
import { MatInput } from '../mat/input';
import { AppTextField } from './text-field';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CdkProjectedContent, AppTextField, MatInput, MatDatepicker],
  templateUrl: 'home.html',
  styleUrl: 'home.css',
})
export class AppHome {
  protected readonly required = (value: string) => value !== '';

  protected readonly today = new Date().getDate();
}
