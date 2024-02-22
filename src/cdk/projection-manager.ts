import {
  Directive,
  Injectable,
  Signal,
  computed,
  contentChildren,
  inject,
  signal,
} from '@angular/core';
import { CdkProjectedContent } from './content';
import {
  CDK_EXPOSE_PROJECTION_SLOTS,
  CDK_PROJECTED_CONTENT,
  CDK_PROJECTION_MANAGER,
} from './injection-tokens';

@Injectable()
export abstract class CdkProjectionManager {
  protected readonly parentProjectionManager = inject(CDK_PROJECTION_MANAGER, {
    optional: true,
    skipSelf: true,
  });

  protected readonly expose = inject(CDK_EXPOSE_PROJECTION_SLOTS, {
    optional: true,
    self: true,
  });

  protected abstract readonly contents: Signal<
    ReadonlyArray<CdkProjectedContent>
  >;

  readonly templates = computed(() => {
    const templates = new Map(
      this.contents().map(({ name, template }) => [name(), template] as const),
    );
    if (this.expose && this.parentProjectionManager) {
      const parentTemplates = this.parentProjectionManager.templates();
      for (const [from, to] of this.expose.aliases()) {
        const template = parentTemplates.get(from);
        if (template) {
          templates.set(to, template);
        }
      }
    }
    return templates;
  });

  readonly registeredContent = signal<Map<any, any[]>>(new Map());

  registerContent(add: Map<any, any>) {
    this.registeredContent.update((current) => {
      for (const [token, instance] of add) {
        current.set(token, [...(current.get(token) ?? []), instance]);
      }
      return new Map(current);
    });
  }

  unregisterContent(remove: Map<any, any>) {
    this.registeredContent.update((current) => {
      for (const [token, instance] of remove) {
        current.set(
          token,
          (current.get(token) ?? []).filter((i) => i !== instance),
        );
      }
      return new Map(current);
    });
  }
}

@Directive({
  standalone: true,
  providers: [
    {
      provide: CDK_PROJECTION_MANAGER,
      useExisting: CdkAcceptsProjectedContent,
    },
  ],
})
export class CdkAcceptsProjectedContent extends CdkProjectionManager {
  protected readonly contents = contentChildren(CDK_PROJECTED_CONTENT);
}
