import { InjectionToken } from '@angular/core';
import type { MatInput } from './input';
import type { MatTextField } from './text-field';

export const MAT_TEXT_FIELD = new InjectionToken<MatTextField>(
  'MAT_TEXT_FIELD',
);

export const MAT_INPUT = new InjectionToken<MatInput>('MAT_INPUT');
