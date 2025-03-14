import { FeatureDefinition } from '../../types/feature-loader';
import { isFeatureEnabled } from './config';
import './style.css';

// @ts-ignore
import hooks from './flex-hooks/**/*.*';

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: 'terms-and-condition', hooks: typeof hooks === 'undefined' ? [] : hooks };
};
