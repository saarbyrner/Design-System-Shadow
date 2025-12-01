// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Toast, SelectOption } from '@kitman/components/src/types';

export const isTimeoutError = (responseText: ?string) =>
  responseText && responseText.includes('Timeout::Error');

export const getErrorToast = (error: Object): $Shape<Toast> => {
  let errorText = i18n.t('There was an error loading your report.');
  let errorStatus = 'ERROR';
  let description;

  if (error && isTimeoutError(error.responseText)) {
    errorStatus = 'WARNING';
    errorText = i18n.t('Unable to download');
    description = i18n.t(
      'Report too large. Try to reduce the number of squads selected.'
    );
  }

  return {
    status: errorStatus,
    title: errorText,
    description,
  };
};

export const stripMarkup = (markup: string) => {
  const hiddenElement = document.createElement('div');
  hiddenElement.hidden = true;
  hiddenElement.innerHTML = markup;
  const textContent =
    hiddenElement.textContent || hiddenElement.innerText || '';

  hiddenElement.remove();

  return textContent;
};

export const getDynamicGroupingOptions = (
  coachesReportV2: boolean
): Array<SelectOption> => {
  return coachesReportV2
    ? [
        {
          value: null,
          label: i18n.t('No grouping'),
        },
        {
          value: 'position',
          label: i18n.t('By Position'),
        },
        {
          value: 'availability_asc',
          label: i18n.t('Availability ascending'),
        },
        {
          value: 'availability_desc',
          label: i18n.t('Availability descending'),
        },
      ]
    : [
        {
          value: 'no_grouping',
          label: i18n.t('No grouping'),
        },
        {
          value: 'position_group_position',
          label: i18n.t('By Position'),
        },
        {
          value: 'position_group',
          label: i18n.t('Offense / Defense'),
        },
        {
          value: 'injury_status',
          label: i18n.t('Out / Limited / Full'),
        },
        {
          value: 'injury_status_reverse',
          label: i18n.t('Full / Limited / Out'),
        },
      ];
};
