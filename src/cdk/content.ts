import { Directive, TemplateRef, inject, input } from '@angular/core';
import { CDK_PROJECTED_CONTENT } from './injection-tokens';

@Directive({
  selector: 'ng-template[cdkProject]',
  standalone: true,
  providers: [
    { provide: CDK_PROJECTED_CONTENT, useExisting: CdkProjectedContent },
  ],
})
export class CdkProjectedContent {
  readonly name = input.required<string>({ alias: 'cdkProject' });

  readonly template = inject(TemplateRef);
}
