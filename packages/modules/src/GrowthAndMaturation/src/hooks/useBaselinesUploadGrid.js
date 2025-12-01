// @flow
import { useMemo, useState, type Node } from 'react';
import { useDispatch } from 'react-redux';

import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';
import { TextLink, TextButton } from '@kitman/components';
import {
  onOpenAddAthletesSidePanel,
  closeMassUploadModal,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import {
  isDateValid,
  getDataTypeGuideline,
  parseGender,
  getLabels,
  buildRowData,
} from '@kitman/modules/src/shared/MassUpload/utils';
import type {
  GridConfig,
  Column,
  Validation,
  UseGrid,
  BaselinesCSV,
  DataTypeGuidelines,
} from '@kitman/modules/src/shared/MassUpload/New/types';

import baselinesHeaders from '../utils/baselinesHeaders';

const styles = {
  instructionsContainer: {
    '.textButton__text': {
      color: colors.grey_200,
      fontWeight: 600,

      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
};

export const emptyTableText = i18n.t('No valid data was found in csv.');

const gridId = 'AthleteUploadGrid';

const acceptedDateFormats = [
  'YYYY-MM-DD',
  'YYYY/MM/DD',
  'DD-MM-YYYY',
  'DD/MM/YYYY',
];

const acceptedAssessmentMethods = [
  'Measured by staff',
  'Self Reported',
  'Not Available',
];

const getGuidelines = (): DataTypeGuidelines => [
  {
    label: i18n.t('date_of_birth_of_player'),
    isRequired: true,
    acceptedValues: [getLabels().dateFormatGuide],
  },
  {
    label: i18n.t('gender'),
    isRequired: true,
    acceptedValues: [
      i18n.t('Male, m'),
      i18n.t('Female, f'),
      i18n.t('Other, o'),
    ],
  },
  {
    label: i18n.t('method_for_assessing_mothers_height'),
    isRequired: true,
    acceptedValues: [
      i18n.t('Self reported'),
      i18n.t('Measured by staff'),
      i18n.t('Not available'),
    ],
  },
  {
    label: i18n.t('biological_mothers_height_cm'),
    acceptedValues: [getLabels().parentHeightValueExample],
  },
  {
    label: i18n.t('method_for_assessing_fathers_height'),
    isRequired: true,
    acceptedValues: [
      i18n.t('Self reported'),
      i18n.t('Measured by staff'),
      i18n.t('Not available'),
    ],
  },
  {
    label: i18n.t('biological_fathers_height_cm'),
    acceptedValues: [getLabels().parentHeightValueExample],
  },
];

const isMethodForAssessingValid = (method: string) =>
  acceptedAssessmentMethods.some(
    (assessmentMethod) =>
      assessmentMethod.toLowerCase() === method.toLowerCase()
  );

const isHeightValueValid = (
  value: number | string | null,
  methodForAssessing: string
) => {
  const isNotRequired = methodForAssessing.toLowerCase() === 'not available';
  const isNumericallyValid = !Number.isNaN(+value) && +value > 0;

  if (isNotRequired) {
    return true;
  }
  return isNumericallyValid;
};

const buttonText = i18n.t('Import a CSV file');
const title = i18n.t('Import a Khamis-Roche baseline file');

const useBaselinesUploadGrid = ({
  parsedCsv,
}: {
  parsedCsv: Array<BaselinesCSV>,
}): UseGrid => {
  const [isMalformedData, setIsMalformedData] = useState(false);

  const dispatch = useDispatch();

  const columns: Array<Column> = useMemo(() => baselinesHeaders, []);

  const validation: Validation = {
    date_of_birth_of_player: (value) =>
      isDateValid({ date: value, acceptedFormats: acceptedDateFormats })
        ? null
        : i18n.t(
            'Date of Birth of Player needs to be in one of the following formats: YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, DD/MM/YYYY'
          ),
    gender: (value) =>
      parseGender(value)
        ? null
        : i18n.t(
            'Gender needs to be in one of the following formats: Male or M, Female or F, Other or O (case insensitive)'
          ),
    method_for_assessing_mothers_height: (value) =>
      isMethodForAssessingValid(value)
        ? null
        : i18n.t(
            'Method for Assessing Mothers Height needs to be in one of the following options (case insensitive): Measured by staff, Self Reported or Not Available'
          ),
    biological_mothers_height_cm: (value, athlete) =>
      isHeightValueValid(value, athlete.method_for_assessing_mothers_height)
        ? null
        : i18n.t(
            'Biological Mothers Height needs to be a number, and greater than 0'
          ),
    method_for_assessing_fathers_height: (value) =>
      isMethodForAssessingValid(value)
        ? null
        : i18n.t(
            'Method for Assessing Fathers Height needs to be in one of the following options (case insensitive): Measured by staff, Self Reported or Not Available'
          ),
    biological_fathers_height_cm: (value, athlete) =>
      isHeightValueValid(value, athlete.method_for_assessing_fathers_height)
        ? null
        : i18n.t(
            'Biological Fathers Height needs to be a number, and greater than 0'
          ),
  };

  const ruleset: Node = useMemo(
    () => (
      <div css={styles.instructionsContainer}>
        <p>
          {`${getLabels().downloadTemplateForGrowthAndMaturation} `}
          <TextLink
            text={i18n.t('Growth and maturation assessments.')}
            kitmanDesignSystem
            href="/growth_and_maturation/assessments?action=open-side-panel"
            onClick={() => {
              dispatch(closeMassUploadModal());
            }}
          />
        </p>
        <p>
          {`${getLabels().downloadTemplateForKhamisRoche} `}
          {window.getFlag('mui-mass-upload') ? (
            <TextLink
              text={i18n.t('Khamis-Roche baselines.')}
              kitmanDesignSystem
              href="/growth_and_maturation/assessments/baselines?action=open-side-panel"
            />
          ) : (
            <TextButton
              text={i18n.t('Khamis-Roche baselines.')}
              kitmanDesignSystem
              type="textOnly"
              onClick={() => {
                dispatch(closeMassUploadModal());
                dispatch(onOpenAddAthletesSidePanel());
              }}
            />
          )}
        </p>

        <p>{`${getLabels().generalFormatGuide}:`}</p>
        {getGuidelines().map(getDataTypeGuideline)}
      </div>
    ),
    []
  );

  const rows = useMemo(
    () =>
      buildRowData(setIsMalformedData, parsedCsv, validation, columns, true),
    [parsedCsv]
  );

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText,
    id: gridId,
  };

  return {
    grid,
    isLoading: false,
    isError: isMalformedData,
    ruleset,
    buttonText,
    title,
  };
};

export default useBaselinesUploadGrid;
