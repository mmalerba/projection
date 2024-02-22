import {
  Directive,
  Inject,
  InjectionToken,
  Optional,
  TemplateRef,
  inject,
  input,
} from '@angular/core';
import {
  CDK_CONTENT_REGISTRATION,
  CDK_PROJECTED_CONTENT,
  CDK_PROJECTION_MANAGER,
} from './injection-tokens';
import { CdkProjectionManager } from './projection-manager';

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

export const cdkRegisterContent = (...tokens: any[]) => {
  return {
    provide: CDK_CONTENT_REGISTRATION,
    deps: [
      [new Optional(), new Inject(CDK_PROJECTION_MANAGER)],
      ...tokens.map((token) =>
        token instanceof InjectionToken ? [new Inject(token)] : token,
      ),
    ],
    useFactory: (
      projectionManager?: CdkProjectionManager,
      ...instances: any[]
    ) => {
      if (projectionManager) {
        let content = new Map();
        for (let i = 0; i < tokens.length; i++) {
          content.set(tokens[i], instances[i]);
        }
        projectionManager.registerContent(content);
        return {
          destroy: () => {
            projectionManager.unregisterContent(content);
          },
        };
      }
      return { destroy: () => {} };
    },
  };
};

@Directive({
  standalone: true,
})
export class CdkRegistersContent {
  protected registration = inject(CDK_CONTENT_REGISTRATION);

  protected ngOnDestroy() {
    this.registration.destroy();
  }
}
