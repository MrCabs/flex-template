import { array } from 'prop-types';
import { getFeatureFlags, getFlexFeatureFlag } from '../../utils/configuration';
import TermsAndConditionConfig from './types/ServiceConfiguration';

const { enabled = false,
  recordings = []
 } = (getFeatureFlags()?.features?.terms_and_condition as TermsAndConditionConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getRecordings = () => {
  if (!isFeatureEnabled()) return [];

  let getRecordings = recordings ? recordings: [];
  return getRecordings;
}