import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { MAT_INPUT, MAT_TEXT_FIELD } from './injection-tokens';

@Component({
  selector: 'input[matInput]',
  standalone: true,
  template: '',
  host: {
    '[value]': 'value()',
    '(input)': 'handleInput($event)',
  },
  providers: [{ provide: MAT_INPUT, useExisting: MatInput }],
  styleUrl: 'input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatInput {
  readonly value = model<string>('');

  readonly validator = input<(v: string) => boolean>(() => true);

  readonly valid = computed(() => this.validator()(this.value()));

  protected readonly textField = inject(MAT_TEXT_FIELD);

  protected handleInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected ngOnInit() {
    this.textField.input.set(this);
  }
}
