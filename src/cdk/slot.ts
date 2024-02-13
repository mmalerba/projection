import {
  Directive,
  Injector,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { CDK_PROJECTION_MANAGER } from './injection-tokens';

@Directive({
  selector: 'ng-template[cdkSlot]',
  standalone: true,
})
export class CdkProjectionSlot {
  readonly name = input.required<string>({ alias: 'cdkSlot' });

  protected readonly defaultTemplate = inject(TemplateRef);

  protected readonly viewContainerRef = inject(ViewContainerRef);

  protected readonly injector = inject(Injector);

  protected readonly projectionManager = inject(CDK_PROJECTION_MANAGER);

  protected readonly content = computed(
    () =>
      this.projectionManager.templates().get(this.name()) ??
      this.defaultTemplate,
  );

  constructor() {
    effect(
      (onCleanup) => {
        const viewRef = this.viewContainerRef.createEmbeddedView(
          this.content(),
          undefined,
          { injector: this.injector },
        );
        onCleanup(() => viewRef.destroy());
      },
      {
        allowSignalWrites: true,
      },
    );
  }
}
