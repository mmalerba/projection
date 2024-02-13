import { Directive, computed, input } from '@angular/core';
import { CDK_EXPOSE_PROJECTION_SLOTS } from './injection-tokens';

@Directive({
  selector: '[cdkExposeSlots]',
  standalone: true,
  providers: [
    {
      provide: CDK_EXPOSE_PROJECTION_SLOTS,
      useExisting: CdkExposeProjectionSlots,
    },
  ],
})
export class CdkExposeProjectionSlots {
  readonly aliasStrings = input.required<string[]>({
    alias: 'cdkExposeSlots',
  });

  readonly aliases = computed(
    () =>
      new Map(
        this.aliasStrings().map((s) => {
          const [from, to] = s.split(':');
          return [from, to ?? from];
        }),
      ),
  );
}
