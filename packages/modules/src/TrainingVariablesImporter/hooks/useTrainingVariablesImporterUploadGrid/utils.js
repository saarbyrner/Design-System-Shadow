// @flow
import type { Node } from 'react';
import moment from 'moment';

import type {
  Validation,
  DataTypeGuidelines,
} from '@kitman/modules/src/shared/MassUpload/New/types';
import i18n from '@kitman/common/src/utils/i18n';
import { getDataTypeGuideline } from '@kitman/modules/src/shared/MassUpload/utils';
import {
  isIntNumber,
  isPositiveIntNumber,
} from '@kitman/common/src/utils/inputValidation';
import { TextLink } from '@kitman/components';

import { ExpectedHeaders, OptionalExpectedHeaders } from '../../consts';

const getGuidelinesFirstPart = () => {
  return i18n.t(
    'Please ensure you use the CSV file template to have the correct'
  );
};

const timeMeasuredExamples = {
  example1: '2023-10-12T04:25:03Z',
  example2: '2023-10-12',
  example3: '2023-10-12 04:25',
  example4: '2023/10/12',
  example5: '2023/10/12 04:25',
};

export const getGuidelines = (): DataTypeGuidelines => {
  const firstPart = getGuidelinesFirstPart();

  return [
    {
      label: ExpectedHeaders.Id,
      acceptedValues: [
        i18n.t('{{firstPart}} id', {
          firstPart,
          interpolation: { escapeValue: false },
        }),
      ],
    },
    {
      label: ExpectedHeaders.FirstName,
      acceptedValues: [
        i18n.t('{{firstPart}} first name', {
          firstPart,
          interpolation: { escapeValue: false },
        }),
      ],
    },
    {
      label: ExpectedHeaders.LastName,
      acceptedValues: [
        i18n.t('{{firstPart}} last name', {
          firstPart,
          interpolation: { escapeValue: false },
        }),
      ],
    },
    {
      label: ExpectedHeaders.TimeMeasured,
      // $FlowIgnore[incompatible-return] the types are fine here.
      acceptedValues: Object.values(timeMeasuredExamples),
    },
    {
      label: OptionalExpectedHeaders.MicroCycle,
      acceptedValues: [
        i18n.t('If filled, the entry must be a whole number: 0 or greater.'),
      ],
      isRequired: false,
    },
  ];
};

export const getValidators = (): Validation => ({
  [ExpectedHeaders.Id]: (value: string) => {
    return isIntNumber(value) ? null : i18n.t('Please enter a valid id');
  },
  [ExpectedHeaders.FirstName]: (value) => {
    return !isIntNumber(value) && value.length
      ? null
      : i18n.t('Please enter a valid first name');
  },
  [ExpectedHeaders.LastName]: (value) => {
    return !isIntNumber(value) && value.length
      ? null
      : i18n.t('Please enter a valid last name');
  },
  [ExpectedHeaders.TimeMeasured]: (value) => {
    const getFormattedValue = (format: string): string =>
      moment.utc(value).format(format);
    return [
      'YYYY-MM-DD',
      'YYYY-MM-DD HH:mm',
      'YYYY/MM/DD',
      'YYYY/MM/DD HH:mm',
      'YYYY-MM-DD[T]HH:mm:ss[Z]',
    ]
      .map(getFormattedValue)
      .includes(value)
      ? null
      : i18n.t(
          'This format does not match one of the accepted formats: {{example1}}, {{example2}}, {{example3}}, {{example4}}, {{example5}}',
          {
            // example1-5 must be kept in sync with timeMeasuredExamples.
            example1: '2023-10-12T04:25:03Z',
            example2: '2023-10-12',
            example3: '2023-10-12 04:25',
            example4: '2023/10/12',
            example5: '2023/10/12 04:25',
            interpolation: { escapeValue: false },
          }
        );
  },
  [OptionalExpectedHeaders.MicroCycle]: (value) => {
    return !value || isPositiveIntNumber(value)
      ? null
      : i18n.t('Please ensure value is a whole number: 0 or greater');
  },
});

export const getRuleset = (): Node => (
  <>
    <p>
      {i18n.t(
        'To avoid errors make sure you are importing the correct template file type for this submission. Download a CSV file template for'
      )}{' '}
      <TextLink
        text={i18n.t('required fields')}
        kitmanDesignSystem
        type="textOnly"
        href="/data_importer?action=open-side-panel"
      />
      .
    </p>

    {getGuidelines().map((guideline, i) =>
      getDataTypeGuideline({
        ...guideline,
        isRequired: guideline.isRequired ?? true,
        key: String(i),
      })
    )}

    <p>
      {i18n.t(
        'The training variables to be uploaded are added after the above fields. Please reach out to your Kitman Representative to get a list of these for your organization.'
      )}
    </p>
  </>
);
