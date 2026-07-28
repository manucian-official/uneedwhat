import { SetMetadata } from '@nestjs/common';

export const REQUIRED_FEATURE_KEY = 'requiredFeature';
export const RequirePlanFeature = (feature: string) =>
  SetMetadata(REQUIRED_FEATURE_KEY, feature);
