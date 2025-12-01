/* eslint-disable flowtype/require-valid-file-annotation */

import $ from 'jquery';
import { TrackEvent } from '@kitman/common/src/utils';
import renderAthleteIssueDetails from '@kitman/modules/src/AthleteInjury/athleteIssueDetails';
import initAthleteIssueEditor from '@kitman/modules/src/AthleteInjury/athleteIssueEditor';

// flag to prevent the animation from appearing (eg the modal is opened
// and closed too quickly, before 2 seconds passes)
window.enableLoadingAnimation = false;

export const showLoading = (loaderClassName, loadingAnimationEnabled) => {
  if (loadingAnimationEnabled) {
    window.enableLoadingAnimation = loadingAnimationEnabled;
  }

  const $loader = $(`.${loaderClassName}`);

  // only show the loading animation if the modal doesn't appear in 2 seconds
  setTimeout(() => {
    if (window.enableLoadingAnimation) {
      $loader.show();
    }
  }, 2000);
};

export const hideLoading = (loaderClassName) => {
  window.enableLoadingAnimation = false;
  $(`.${loaderClassName}`).hide();
};

export const enableLoading = () => {
  window.enableLoadingAnimation = true;
};

export const injuryDetailsLinkClickHandler = () => {
  const $athleteInjuryDetailsLink = $('.js-athleteInjuryDetailsLink');
  if ($athleteInjuryDetailsLink.length > 0) {
    $athleteInjuryDetailsLink.on('click', (e) => {
      e.preventDefault();
      const athlete = JSON.parse(e.currentTarget.dataset.athlete);
      const issueId = e.currentTarget.dataset.issueId;
      enableLoading();
      showLoading('js-athleteIssueDetailsLoader');
      renderAthleteIssueDetails(athlete, issueId, 'INJURY', hideLoading);

      TrackEvent('emr details injury', 'click', 'action details injury');
    });
  }
};

export const illnessDetailsLinkClickHandler = () => {
  const $athleteIllnessDetailsLink = $('.js-athleteIllnessDetailsLink');
  if ($athleteIllnessDetailsLink.length > 0) {
    $athleteIllnessDetailsLink.on('click', (e) => {
      e.preventDefault();
      const athlete = JSON.parse(e.currentTarget.dataset.athlete);
      const issueId = e.currentTarget.dataset.issueId;
      enableLoading();
      showLoading('js-athleteIssueDetailsLoader');
      renderAthleteIssueDetails(athlete, issueId, 'ILLNESS', hideLoading);

      TrackEvent('emr details illness', 'click', 'action details illness');
    });
  }
};

export const addNewIssueClickHandler = (e) => {
  e.preventDefault();
  const athlete = JSON.parse(e.currentTarget.dataset.athlete);
  enableLoading();
  showLoading('js-athleteInjuryEditLoader');
  const formMode = 'CREATE';
  initAthleteIssueEditor(formMode, 'INJURY', athlete, null, hideLoading);

  TrackEvent('squad overview add injury', 'click', 'action add injury');
};
