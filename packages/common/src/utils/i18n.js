/* eslint-disable */
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend'; // primary use cache
import XHR from 'i18next-xhr-backend'; // fallback xhr load

export const initiateTranslation = () => {
  const globalNs = 'translation';
  const sportSpecificNs = window.organisationSport;

  i18next.use(Backend).init({
    lng: window.userLocale,
    fallbackLng: 'en',
    debug: false,
    ns: sportSpecificNs ? [sportSpecificNs, globalNs] : [globalNs],
    defaultNS: sportSpecificNs ?? globalNs,
    fallbackNS: globalNs,
    backend: {
      backends: [
        LocalStorageBackend, // primary
        XHR, // fallback
      ],
      backendOptions: [
        {
          // expiration
          expirationTime: 7 * 24 * 60 * 60 * 1000, // expire in 7 days
          // When "defaultVersion" changes, the cache is invalidated and
          // the new version of the translations are downloaded.
          // We use the file names concatenated as a version. As they contain
          // a content hash, the cache will be invalidated at each change.
          defaultVersion: Object.entries(window.localePaths)
            .map(([fileKey, fileNameWithHash]) => fileNameWithHash)
            .join(),
        },
        {
          loadPath: (lng, ns) =>
            window.localePaths[`${lng}_${ns}`] ||
            window.localePaths[`${lng}_${globalNs}`], // xhr load path for my own fallback
        },
      ],
    },
    saveMissing: false,
    react: {
      wait: true,
    },
    keySeparator: '>',
    nsSeparator: '|',
    joinArrays: ' ',
  });
};

/*
 * In the Ruby on Rails application, the userLocale is already accessible at this point.
 * We do not need to wait for the data to be loaded to run initiateTranslation.
 * This can be removed once we are using a Single Page Application
 */
if (window.userLocale) {
  initiateTranslation();
}

export default i18next;
