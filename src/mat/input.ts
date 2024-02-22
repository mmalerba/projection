import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { CdkRegistersContent, cdkRegisterContent } from '../cdk/content';
import { MAT_INPUT } from './injection-tokens';

@Component({
  selector: 'input[matInput]',
  standalone: true,
  template: '',
  host: {
    '[value]': 'value()',
    '(input)': 'handleInput($event)',
  },
  providers: [
    { provide: MAT_INPUT, useExisting: MatInput },
    cdkRegisterContent(MAT_INPUT),
  ],
  hostDirectives: [CdkRegistersContent],
  styleUrl: 'input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatInput {
  readonly value = model<string>('');

  readonly validator = input<(v: string) => boolean>(() => true);

  readonly valid = computed(() => this.validator()(this.value()));

  protected handleInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value ?? '');
  }
}
