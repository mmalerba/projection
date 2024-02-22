import { InjectionToken } from '@angular/core';
import type { CdkProjectedContent } from './content';
import type { CdkExposeProjectionSlots } from './expose';
import type { CdkProjectionManager } from './projection-manager';

export const CDK_PROJECTED_CONTENT = new InjectionToken<CdkProjectedContent>(
  'CDK_PROJECTED_CONTENT',
);

export const CDK_PROJECTION_MANAGER = new InjectionToken<CdkProjectionManager>(
  'CDK_PROJECTION_MANAGER',
);

export const CDK_EXPOSE_PROJECTION_SLOTS =
  new InjectionToken<CdkExposeProjectionSlots>('CDK_EXPOSE_PROJECTION_SLOTS');

export const CDK_CONTENT_REGISTRATION = new InjectionToken<{
  destroy: () => void;
}>('CDK_CONTENT_REGISTRATION');
