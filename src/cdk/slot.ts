import {
  Directive,
  EmbeddedViewRef,
  InjectionToken,
  Injector,
  Signal,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { CDK_PROJECTION_MANAGER } from './injection-tokens';

@Directive({
  selector: 'ng-template[cdkSlot]',
  standalone: true,
  exportAs: 'cdkSlot',
})
export class CdkProjectionSlot {
  readonly name = input.required<string>({ alias: 'cdkSlot' });

  readonly context = input<any>(undefined, { alias: 'cdkSlotContext' });

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
    effect((onCleanup) => {
      let viewRef: EmbeddedViewRef<unknown>;
      untracked(() => {
        viewRef = this.viewContainerRef.createEmbeddedView(
          this.content(),
          this.context(),
          { injector: this.injector },
        );
      });
      onCleanup(() => viewRef.destroy());
    });
  }

  query<T>(
    token: T,
  ): T extends InjectionToken<infer R>
    ? Signal<R | undefined>
    : T extends abstract new (...args: any) => any
      ? Signal<InstanceType<T> | undefined>
      : never {
    return this.projectionManager.query(token);
  }

  queryAll<T>(
    token: T,
  ): T extends InjectionToken<infer R>
    ? Signal<R[]>
    : T extends abstract new (...args: any) => any
      ? Signal<InstanceType<T>[]>
      : never {
    return this.projectionManager.queryAll(token);
  }
}
