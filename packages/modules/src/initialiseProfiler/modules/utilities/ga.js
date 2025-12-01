/* eslint-disable no-undef, prefer-rest-params, func-names */

/*
 * Initiates Google Analytics on the single page application
 * We reproduce the same approach as on Medinah: medinah/app/views/shared/_google_analytics.html.erb
 * which is based on https://developers.google.com/analytics/devguides/collection/analyticsjs/#alternative_async_tag
 */
const initiateGoogleAnalytics = (gaSettings) => {
  if (!gaSettings?.include_ga) return;

  // prettier-ignore
  window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};
  ga.l = +new Date();

  ga('create', gaSettings.tracking_id, 'auto');
  ga('send', 'pageview');
  if (gaSettings.userId) ga('set', '&uid', gaSettings.userId);
  if (gaSettings.organisationName)
    ga('set', 'dimension1', gaSettings.organisationName);
};

export default (gaSettings) => {
  initiateGoogleAnalytics(gaSettings);

  /*
   * Initiates tracking based on data-attributes. This is used only in the Ruby on Rails application
   * ref: ga_track_click(category = nil, label = nil) in medinah/app/helpers/application_helpers.rb
   */
  $(() => {
    // Note: event and category are required
    $('[data-ga-track-event][data-ga-track-category]').click(function () {
      if (typeof ga === 'function') {
        const $this = $(this);
        const opts = {};
        const isModal = $this.attr('rel') === 'ajax_modal';

        if (!isModal) {
          // If this isn't a modal use the 'beacon' transport method to avoid
          // JS execution being killed because of navigating away from the page.
          opts.transport = 'beacon';
        }

        ga(
          'send',
          'event',
          $this.data('ga-track-category'),
          $this.data('ga-track-event'),
          $this.data('ga-track-label'),
          opts
        );
      }
    });
  });
};
