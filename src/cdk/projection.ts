import {
  ContentChildren,
  Directive,
  Injectable,
  Injector,
  QueryList,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
  runInInjectionContext,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';

@Directive({
  selector: 'ng-template[cdkProject]',
  standalone: true,
})
export class CdkProjectedContent {
  readonly name = input.required<string>({ alias: 'cdkProject' });

  readonly template = inject(TemplateRef);
}

@Directive({
  selector: 'ng-template[cdkSlot]',
  standalone: true,
})
export class CdkProjectionSlot {
  readonly name = input.required<string>({ alias: 'cdkSlot' });

  protected readonly defaultTemplate = inject(TemplateRef);

  protected readonly viewContainerRef = inject(ViewContainerRef);

  protected readonly projectionManager = inject(CdkProjectionManager);

  protected ngOnInit() {
    const template =
      this.projectionManager.getContent(this.name())?.template ??
      this.defaultTemplate;
    this.viewContainerRef.createEmbeddedView(template);
  }
}

@Directive({
  selector: '[cdkExposeSlot]',
  standalone: true,
})
export class CdkExposeProjectionSlot {
  readonly expose = input.required<{ [key: string]: string }>({
    alias: 'cdkExposeSlot',
  });
}

@Injectable()
export class CdkProjectionManager {
  protected readonly parentProjectionManager = inject(CdkProjectionManager, {
    optional: true,
    skipSelf: true,
  });

  protected readonly expose = inject(CdkExposeProjectionSlot, {
    optional: true,
    self: true,
  });

  protected readonly contents = new Map<string, CdkProjectedContent>();

  updateContents(contents: CdkProjectedContent[]) {
    this.contents.clear();
    for (const content of contents) {
      this.contents.set(content.name(), content);
    }
  }

  getContent(name: string): CdkProjectedContent | null {
    let content = this.contents.get(name) ?? null;
    if (this.expose && this.expose.expose()[name]) {
      content =
        this.parentProjectionManager?.getContent(this.expose.expose()[name]) ??
        content;
    }
    return content;
  }
}

@Directive({
  standalone: true,
  providers: [CdkProjectionManager],
})
export class CdkAcceptsProjectedContent {
  protected readonly projectionManager = inject(CdkProjectionManager);

  protected readonly injector = inject(Injector);

  @ContentChildren(CdkProjectedContent)
  protected readonly contents!: QueryList<CdkProjectedContent>;

  protected ngAfterContentInit() {
    runInInjectionContext(this.injector, () => {
      this.contents.changes
        .pipe(startWith(null), takeUntilDestroyed())
        .subscribe({
          next: () =>
            this.projectionManager.updateContents(this.contents.toArray()),
          complete: () => this.projectionManager.updateContents([]),
        });
    });
  }
}
