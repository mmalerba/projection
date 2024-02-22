import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { CdkProjectedContent } from '../cdk/content';
import { CdkExposeProjectionSlots } from '../cdk/expose';
import { CDK_PROJECTION_MANAGER } from '../cdk/injection-tokens';
import { CdkAcceptsProjectedContent } from '../cdk/projection-manager';
import { CdkProjectionSlot } from '../cdk/slot';
import { MAT_DATEPICKER, MAT_INPUT } from './injection-tokens';
import { MatTextField } from './text-field';

@Component({
  selector: 'mat-datepicker',
  standalone: true,
  templateUrl: 'datepicker.html',
  styleUrl: 'datepicker.css',
  host: {
    '(focusin)': 'toggle($event)',
    '(focusout)': 'toggle($event)',
  },
  providers: [{ provide: MAT_DATEPICKER, useExisting: MatDatepicker }],
  imports: [
    CdkProjectionSlot,
    CdkProjectedContent,
    CdkExposeProjectionSlots,
    MatTextField,
    NgTemplateOutlet,
  ],
  hostDirectives: [CdkAcceptsProjectedContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDatepicker {
  protected readonly isOpen = signal(false);

  protected readonly hostEl = inject(ElementRef);

  protected readonly projectionManager = inject(CDK_PROJECTION_MANAGER);

  protected readonly input = this.projectionManager.query(MAT_INPUT);

  protected dates: Array<number | null>[] = [];

  protected monthName: string;

  constructor() {
    const firstDay = new Date();
    firstDay.setDate(1);
    firstDay.setHours(0, 0, 0, 0);
    const lastDay = new Date(
      firstDay.getFullYear(),
      firstDay.getMonth() + 1,
      0,
    );
    let dates = [];
    for (let d = 0; d < firstDay.getDay(); d++) {
      dates.push(null);
    }
    for (let d = firstDay.getDate(); d <= lastDay.getDate(); d++) {
      dates.push(d);
    }
    for (let d = lastDay.getDay() + 1; d < 7; d++) {
      dates.push(null);
    }
    this.dates = [];
    while (dates.length > 0) {
      this.dates.push(dates.splice(0, 7));
    }
    this.monthName = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(firstDay);
  }

  protected toggle(event: FocusEvent) {
    if (!this.hostEl.nativeElement.contains(event.relatedTarget)) {
      this.isOpen.update((open) => !open);
    }
  }

  select(date: number) {
    let d = new Date();
    d.setDate(date);
    d.setHours(0, 0, 0, 0);
    this.input()?.value.set(new Intl.DateTimeFormat('en-US').format(d));
  }
}
