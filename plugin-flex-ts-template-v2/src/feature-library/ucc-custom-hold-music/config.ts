import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false, url = '' } = getFeatureFlags()?.features?.ucc_custom_hold_music || '';

export const isFeatureEnabled = () => {
  return enabled;
};

export const getHoldMusicUrl = () => {
  return url;
};
