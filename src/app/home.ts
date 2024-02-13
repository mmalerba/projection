import { Component } from '@angular/core';
import { CdkProjectedContent } from '../cdk/content';
import { MatInput } from '../mat/input';
import { AppTextField } from './text-field';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CdkProjectedContent, AppTextField, MatInput],
  templateUrl: 'home.html',
  styleUrl: 'home.css',
})
export class AppHome {
  protected readonly required = (value: string) => value !== '';
}
