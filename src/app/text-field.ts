import { Component, input } from '@angular/core';
import { CdkProjectedContent } from '../cdk/content';
import { CdkExposeProjectionSlots } from '../cdk/expose';
import { CdkAcceptsProjectedContent } from '../cdk/projection-manager';
import { MatTextField } from '../mat/text-field';

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: 'text-field.html',
  imports: [CdkProjectedContent, CdkExposeProjectionSlots, MatTextField],
  hostDirectives: [CdkAcceptsProjectedContent],
})
export class AppTextField {
  readonly label = input.required<string>();
}
