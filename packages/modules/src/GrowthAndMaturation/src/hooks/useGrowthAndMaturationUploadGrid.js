// @flow
import { useMemo, useState, type Node } from 'react';
import { useDispatch } from 'react-redux';

import i18n from '@kitman/common/src/utils/i18n';
import { TextLink, TextButton } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import {
  onOpenAddAthletesSidePanel,
  closeMassUploadModal,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import type {
  GridConfig,
  Column,
  Validation,
  UseGrid,
  GrowthAndMaturationCSV,
  DataTypeGuidelines,
} from '@kitman/modules/src/shared/MassUpload//New/types';
import {
  isDateValid,
  parseBoolean,
  getIsIntegerValid,
  getDataTypeGuideline,
  getLabels,
  buildRowData,
} from '@kitman/modules/src/shared/MassUpload/utils';

import growthAndMaturationHeaders from '../utils/growthAndMaturationHeaders';

const styles = {
  instructionsContainer: {
    '.textButton__text': {
      color: colors.grey_200,
      fontWeight: 600,

      ' &:hover': {
        textDecoration: 'underline',
      },
    },
  },
};

const gridId = 'GrowthAndMaturationUploadGrid';

export const emptyTableText = i18n.t('No valid data was found in csv.');

const buttonText = i18n.t('Import a CSV file');
const title = i18n.t('Import a growth and maturation assessment file');

const acceptedDateFormats = [
  'YYYY-MM-DD',
  'YYYY/MM/DD',
  'DD-MM-YYYY',
  'DD/MM/YYYY',
];

const getIsThirdMeasurementRequired = (
  measurement1: number,
  measurement2: number
) => Math.abs(measurement1 - measurement2) > 0.5;

const getThirdMeasurementValidation = ({
  valueOne,
  valueTwo,
  valueThree,
  fieldName,
  differential,
}: {
  valueOne: number,
  valueTwo: number,
  valueThree: number,
  fieldName: string,
  differential: string,
}) => {
  if (getIsThirdMeasurementRequired(valueOne, valueTwo)) {
    if (!valueThree) {
      return i18n.t(
        '{{fieldName}} 3 is required as {{fieldName}} 1 and {{fieldName}} 2 differs more than {{differential}}',
        { fieldName, differential }
      );
    }
    if (!getIsIntegerValid(valueThree)) {
      return i18n.t(
        '{{fieldName}} 3 is required and should be a number greater than 0',
        {
          fieldName,
          differential,
        }
      );
    }
  }
  return null;
};

const getGuidelines = (): DataTypeGuidelines => [
  {
    label: i18n.t('date_measured'),
    acceptedValues: [getLabels().dateFormatGuide],
  },
  {
    label: i18n.t('head_attire_worn'),
    acceptedValues: [
      i18n.t('Yes or No'),
      i18n.t('True or False'),
      i18n.t('Y or N'),
      i18n.t('0 or 1'),
    ],
  },
  {
    label: i18n.t('standing_height_1_cm'),
    acceptedValues: [getLabels().standingHeightValueExample],
  },
  {
    label: i18n.t('standing_height_2_cm'),
    acceptedValues: [getLabels().standingHeightValueExample],
  },
  {
    label: i18n.t('standing_height_3_cm'),
    acceptedValues: [getLabels().standingHeightValueExample],
  },
  {
    label: i18n.t('box_height_cm'),
    acceptedValues: [i18n.t('Example: 40')],
  },
  {
    label: i18n.t('sitting_height_1_cm'),
    acceptedValues: [getLabels().sittingHeightValueExample],
  },
  {
    label: i18n.t('sitting_height_2_cm'),
    acceptedValues: [getLabels().sittingHeightValueExample],
  },
  {
    label: i18n.t('sitting_height_3_cm'),
    acceptedValues: [getLabels().sittingHeightValueExample],
  },
  {
    label: i18n.t('weight_1_kg'),
    acceptedValues: [getLabels().weightValueExample],
  },
  {
    label: i18n.t('weight_2_kg'),
    acceptedValues: [getLabels().weightValueExample],
  },
  {
    label: i18n.t('weight_3_kg'),
    acceptedValues: [getLabels().weightValueExample],
  },
];

const useGrowthAndMaturationUploadGrid = ({
  parsedCsv,
}: {
  parsedCsv: Array<GrowthAndMaturationCSV>,
}): UseGrid => {
  const [isMalformedData, setIsMalformedData] = useState(false);

  const dispatch = useDispatch();

  const columns: Array<Column> = useMemo(() => growthAndMaturationHeaders, []);

  const validation: Validation = {
    date_measured: (value) =>
      isDateValid({ date: value, acceptedFormats: acceptedDateFormats })
        ? null
        : i18n.t(
            'Date Measured needs to be in one of the following formats: YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, DD/MM/YYYY'
          ),
    head_attire_worn: (value) =>
      parseBoolean(value) !== undefined
        ? null
        : i18n.t(
            'Head Attire Worn needs to be one of the following formats: true/false, yes/no, y/n, 1/0'
          ),
    standing_height_1_cm: (value) =>
      getIsIntegerValid(value)
        ? null
        : i18n.t(
            'Standing Height 1 is required and should be a number greater than 0'
          ),
    standing_height_2_cm: (value) =>
      getIsIntegerValid(value)
        ? null
        : i18n.t(
            'Standing Height 2 is required and should be a number greater than 0'
          ),
    standing_height_3_cm: (value, athlete) =>
      getThirdMeasurementValidation({
        valueOne: athlete.standing_height_1_cm,
        valueTwo: athlete.standing_height_2_cm,
        valueThree: value,
        fieldName: 'Standing Height',
        differential: '5mm',
      }),
    box_height_cm: (value) =>
      getIsIntegerValid(value)
        ? null
        : i18n.t(
            'Box Height is required and should be a number greater than 0'
          ),
    sitting_height_1_cm: (value) =>
      getIsIntegerValid(value)
        ? null
        : i18n.t(
            'Sitting Height 1 is required and should be a number greater than 0'
          ),
    sitting_height_2_cm: (value) =>
      getIsIntegerValid(value)
        ? null
        : i18n.t(
            'Sitting Height 2 is required and should be a number greater than 0'
          ),
    sitting_height_3_cm: (value, athlete) =>
      getThirdMeasurementValidation({
        valueOne: athlete.sitting_height_1_cm,
        valueTwo: athlete.sitting_height_2_cm,
        valueThree: value,
        fieldName: 'Sitting Height',
        differential: '5mm',
      }),
    weight_1_kg: (value) =>
      getIsIntegerValid(value)
        ? null
        : i18n.t('Weight 1 is required and should be a number greater than 0'),
    weight_2_kg: (value) =>
      getIsIntegerValid(value)
        ? null
        : i18n.t('Weight 2 is required and should be a number greater than 0'),
    weight_3_kg: (value, athlete) =>
      getThirdMeasurementValidation({
        valueOne: athlete.weight_1_kg,
        valueTwo: athlete.weight_2_kg,
        valueThree: value,
        fieldName: 'Weight',
        differential: '0.5kg',
      }),
  };

  const ruleset: Node = useMemo(
    () => (
      <div css={styles.instructionsContainer}>
        <p>
          {`${getLabels().downloadTemplateForGrowthAndMaturation} `}
          {window.getFlag('mui-mass-upload') ? (
            <TextLink
              text={i18n.t('Growth and maturation assessments.')}
              kitmanDesignSystem
              href="/growth_and_maturation/assessments?action=open-side-panel"
            />
          ) : (
            <TextButton
              text={i18n.t('Growth and maturation assessments.')}
              kitmanDesignSystem
              type="textOnly"
              onClick={() => {
                dispatch(closeMassUploadModal());
                dispatch(onOpenAddAthletesSidePanel());
              }}
            />
          )}
        </p>
        <p>
          {`${getLabels().downloadTemplateForKhamisRoche} `}
          <TextLink
            text={i18n.t('Khamis-Roche baselines.')}
            kitmanDesignSystem
            href="/growth_and_maturation/assessments/baselines?action=open-side-panel"
            onClick={() => {
              dispatch(closeMassUploadModal());
            }}
          />
        </p>

        <p>{`${getLabels().generalFormatGuide}:`}</p>
        {getGuidelines().map((guideline) =>
          getDataTypeGuideline({ ...guideline, isRequired: true })
        )}
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

export default useGrowthAndMaturationUploadGrid;
