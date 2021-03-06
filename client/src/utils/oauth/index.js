import { get } from 'lodash';
import { camelize } from 'humps';

export openPopup from './popup';

export function providerSlug(provider) {
  switch (provider) {
    case 'google':
      return 'google_oauth2';
    default:
      return provider;
  }
}

/**
 * Get the name of the provider key in settings.
 *
 * @param {String} provider
 * @return {String}
 */
export function providerSetting(provider) {
  return camelize(providerSlug(provider));
}

/**
 * @param {String} provider
 * @return {String}
 */
export function getUrl(provider) {
  console.log('__API_URL__');
  return `${__API_URL__}/auth/${providerSlug(provider)}`;
}

/**
 * @param {MessageEvent} event
 * @return {Boolean}
 */
export function isOauthEvent(event) {
  if (get(event, 'data.type') === 'oauth') {
    if (get(event, 'origin') !== __API_URL__) {
      console.error('Origin mismatch, %s is not API', event.origin);

      return false;
    }

    return true;
  }

  return false;
}
