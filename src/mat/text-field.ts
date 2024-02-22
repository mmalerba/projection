import {
  ChangeDetectionStrategy,
  Component,
  computed,
  viewChild,
} from '@angular/core';
import { CdkAcceptsProjectedContent } from '../cdk/projection-manager';
import { CdkProjectionSlot } from '../cdk/slot';
import { MAT_INPUT, MAT_TEXT_FIELD } from './injection-tokens';
import { MatInput } from './input';

@Component({
  selector: 'mat-text-field',
  standalone: true,
  templateUrl: 'text-field.html',
  styleUrl: 'text-field.css',
  host: {
    '[class.empty]': 'value() == ""',
    '[class.valid]': 'valid()',
  },
  providers: [{ provide: MAT_TEXT_FIELD, useExisting: MatTextField }],
  imports: [CdkProjectionSlot, MatInput],
  hostDirectives: [CdkAcceptsProjectedContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatTextField {
  protected readonly inputSlot = viewChild<CdkProjectionSlot>('input');

  protected readonly input = computed(() =>
    this.inputSlot()?.query(MAT_INPUT)(),
  );

  readonly value = computed(() => this.input()?.value() ?? '');

  readonly valid = computed(() => this.input()?.valid() ?? true);
}
