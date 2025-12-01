// @flow
import { type Node, Fragment } from 'react';
import moment from 'moment';
import { uniqueId } from 'lodash';
import copyToClipboard from 'copy-to-clipboard';

import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';
import { isEmailValid as validateEmail } from '@kitman/common/src/utils/validators';
import { IconButton, Box } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';

import buildCellContent from './cells/cellBuilder';
import buildCellContentNew from '../New/utils/cellBuilder';
import type {
  AthleteValidationState,
  DataTypeGuideline,
  UserTypes,
} from '../types';
import type { MassUploadCSVs, Validation, Column, Row } from '../New/types';

const styles = {
  boldLabel: {
    color: colors.grey_200,
    fontWeight: 600,
    margin: 0,
  },
  labelWithoutMargin: { margin: 0 },
};

export const isDateValid = ({
  date,
  acceptedFormats = ['YYYY-MM-DD', 'YYYY/MM/DD'],
}: {
  date: string,
  acceptedFormats?: Array<string>,
}): boolean => {
  return acceptedFormats
    .map((format) => moment(date, format, true).isValid())
    .some(Boolean);
};

export const isInList = ({
  value,
  items,
}: {
  value: string | number,
  items: Array<string | number>,
}): boolean => {
  return items.includes(value);
};

// TODO: Call validateEmail directly in hooks and remove this util
// once hooks have been updated
export const isEmailValid = ({ email }: { email: ?string }) =>
  validateEmail(email);

export const parseBoolean = (value: string | boolean) => {
  switch (String(value).toLowerCase()) {
    case 'true':
    case '1':
    case 'yes':
    case 'y':
      return true;
    case 'false':
    case '0':
    case 'no':
    case 'n':
      return false;
    default:
      return undefined;
  }
};

export const parseGender = (value: string) => {
  switch (value.toLowerCase()) {
    case 'male':
    case 'm':
    case 'female':
    case 'f':
    case 'other':
    case 'o':
      return true;
    default:
      return false;
  }
};

export const getIsIntegerValid = (value: number | string): boolean => {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return !Number.isNaN(parsed) && parsed > 0;
};

export const getCommonRulesetFields = (
  userTypeString:
    | 'player'
    | 'athlete'
    | 'scout'
    | 'staff member'
    | 'official'
    | 'match_monitor'
) => ({
  FirstName: {
    description: i18n.t("The {{userTypeString}}'s First Name.", {
      userTypeString,
    }),
    exampleText: 'John',
    exampleList: [],
  },
  LastName: {
    description: i18n.t("The {{userTypeString}}'s Last Name.", {
      userTypeString,
    }),
    exampleText: 'Doe',
    exampleList: [],
  },
  Email: {
    description: i18n.t(
      'The email address associated with an {{userTypeString}}.',
      {
        userTypeString,
      }
    ),
    exampleText: 'john.doe@email.com',
    exampleList: [],
  },
  DOB: {
    description: i18n.t('The format must be YYYY/MM/DD.'),
    exampleText: 'YEAR/MONTH/DAY',
    exampleList: ['2023/12/31', '2023/01/01'],
  },
});

export const getDataTypeGuideline = ({
  label,
  isRequired = false,
  caseInsensitive = false,
  acceptedValues,
  key,
}: DataTypeGuideline) => (
  <Fragment key={key ?? label}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <p css={styles.boldLabel}>{label}</p>
      <IconButton onClick={() => copyToClipboard(label)}>
        <KitmanIcon name={KITMAN_ICON_NAMES.ContentCopy} fontSize="small" />
      </IconButton>
    </Box>
    {isRequired && <p css={styles.labelWithoutMargin}>{i18n.t('Required.')}</p>}
    {caseInsensitive && (
      <p css={styles.labelWithoutMargin}>{i18n.t('Case insensitive.')}</p>
    )}
    {acceptedValues.length === 1 ? (
      <p>{acceptedValues[0]}</p>
    ) : (
      <>
        {!!acceptedValues.length && (
          <p css={styles.labelWithoutMargin}>{i18n.t('Accepted values:')}</p>
        )}
        <ul>
          {acceptedValues.map((acceptedValue, index) => (
            <li key={`${label}-${acceptedValues[index]}-item`}>
              {acceptedValue}
            </li>
          ))}
        </ul>
      </>
    )}
  </Fragment>
);

export const ATHLETE: UserTypes = 'athlete';
export const USER: UserTypes = 'user';
export const SCOUT: UserTypes = 'scout';
export const OFFICIAL: UserTypes = 'official';
export const OFFICIAL_ASSIGNMENT: UserTypes = 'official_assignment';
export const MATCH_MONITOR: UserTypes = 'match_monitor';
export const MATCH_MONITOR_ASSIGNMENT: UserTypes = 'match_monitor_assignment';

export const EXPECTED_HEADERS: { [key: UserTypes]: Array<string> } = {
  user: ['FirstName', 'LastName', 'Email', 'DOB', 'SquadName'],
  official: ['FirstName', 'LastName', 'Email', 'DOB', 'Language'],
  scout: [
    'FirstName',
    'LastName',
    'Email',
    'DOB',
    'Language',
    'Type',
    'Organisation',
  ],
  athlete: [
    'FirstName',
    'LastName',
    'Email',
    'DOB',
    'SquadName',
    'Country',
    'Position',
  ],
  official_assignment: ['Game ID', 'Email', 'Role'],
  match_monitor: [
    'FirstName',
    'LastName',
    'Email',
    'DOB',
    'Language',
    'SquadName',
    'Type',
  ],
  match_monitor_assignment: ['Game ID', 'Email'],
};

export const GRID_CONFIG = {
  delimitersToGuess: [',', ';'],
  skipEmptyLines: true,
};

export const BUTTONS: { [key: UserTypes]: string } = {
  athlete: i18n.t('Upload Athletes'),
  user: i18n.t('Upload Users'),
  official: i18n.t('Upload Officials'),
  scout: i18n.t('Upload Scouts'),
  official_assignment: i18n.t('Assign Officials'),
  match_monitor: i18n.t('Upload Match Monitors'),
  match_monitor_assignment: i18n.t('Assign Monitors'),
};

export const getLabels = (): { [key: string]: string } => ({
  downloadTemplateForGrowthAndMaturation: i18n.t(
    'To avoid errors make sure you are importing the correct template file type for this submission. Download a CSV file template for'
  ),
  downloadTemplateForKhamisRoche: i18n.t(
    'Also make sure the required Khamis-Roche baseline data has been already submitted for each athlete listed in your import. You only have to do this once per athlete. Download a CSV file template for'
  ),
  generalFormatGuide: i18n.t('Guide to accepted inputs and formatting'),
  dateFormatGuide: i18n.t('Format must be one of the following: {{example}}', {
    example: 'YYYY-MM-DD, YYYY/MM/DD, DD-MM-YYYY, DD/MM/YYYY',
    interpolation: { escapeValue: false },
  }),
  rawDateFormatGuide: i18n.t('Example: {{example}}', {
    example: '2023-10-12T04:25:03Z',
  }),
  standingHeightValueExample: i18n.t('Example: {{example}}', { example: 180 }),
  sittingHeightValueExample: i18n.t('Example: {{example}}', { example: 100 }),
  weightValueExample: i18n.t('Example: {{example}}', { example: 60 }),
  sitAndReachExample: i18n.t('Example: {{example}}', { example: 20 }),
  groinSqueezeExample: i18n.t('Example: {{example}}', { example: 30 }),
  shoulderRotationInternalLeftExample: i18n.t('Example: {{example}}', {
    example: 40,
  }),
  hipMobilityLeftExample: i18n.t('Example: {{example}}', { example: 50 }),
  get parentHeightValueExample() {
    return this.standingHeightValueExample;
  },
});

const athletePreValidationCheck = (
  athlete: MassUploadCSVs,
  validation: Validation
): AthleteValidationState => {
  return Object.fromEntries(
    Object.keys(athlete).map((key) => {
      if (!validation[key]) {
        const errorKey: string = key;
        return {
          ...validation,
          [errorKey]: key,
        };
      }

      // $FlowIgnore[prop-missing] key will exist for specific import
      return [key, validation[key](athlete[key], athlete)];
    })
  );
};

type AthleteCellData = { id: string, content: Node | Array<Node> };

// TODO: once all importers are aligned, refactor this function to
// destructure params from readability
export const buildAthleteCellData = (
  athlete: MassUploadCSVs,
  validation: Validation,
  setIsMalformedData: (value: boolean) => void,
  columns: Array<Column>,
  isMUI: boolean = false
): {
  id: string,
  cells: Array<AthleteCellData>,
  classnames: { is__error: boolean },
} => {
  const validationCheck = athletePreValidationCheck(athlete, validation);
  const hasErrors = Object.values(validationCheck).some(Boolean);

  if (hasErrors) setIsMalformedData(true);

  return {
    id: uniqueId(),
    cells: columns.map<AthleteCellData>((column) => {
      const buildCellContentFunc = isMUI
        ? buildCellContentNew
        : buildCellContent;
      return {
        id: column.row_key,
        content: buildCellContentFunc(
          column,
          athlete,
          validationCheck[column.row_key]
        ),
      };
    }),
    classnames: { is__error: hasErrors },
  };
};

export const buildRowData = (
  setIsMalformedData: (boolean) => void,
  athletes: Array<any>,
  validation: Validation,
  columns: Array<Column>,
  isMUI: boolean = false
): Array<Row> => {
  setIsMalformedData(false);
  return athletes.map((athlete) =>
    // `classnames` and `id` fields are compatible.
    // $FlowIgnore[incompatible-return]
    buildAthleteCellData(
      athlete,
      validation,
      setIsMalformedData,
      columns,
      isMUI
    )
  );
};

export const getGenericAthleteColumns = (athlete: {
  id: string,
  additionalData: {
    firstname: string,
    lastname: string,
  },
}) => ({
  athlete_id: athlete.id,
  athlete_first_name: athlete.additionalData.firstname,
  athlete_last_name: athlete.additionalData.lastname,
});

export const mergeColumns = (
  columns: Array<Column> = [],
  parsedCsv: Array<{ [key: string]: any }> = []
): Array<Column> => {
  const allColumns: Array<string> = Object.keys(parsedCsv?.[0] ?? {});
  return [
    ...columns,
    ...allColumns
      .filter((id) => !columns.some((c) => c.id === id))
      .map((id) => ({
        id,
        row_key: id,
        content: <DefaultHeaderCell title={id} />,
      })),
  ];
};

export const growthAndMaturationTemplateColumns = {
  measured_by_user_id_optional: null,
  head_attire_worn: null,
  standing_height_1_cm: null,
  standing_height_2_cm: null,
  standing_height_3_cm: null,
  box_height_cm: null,
  sitting_height_1_cm: null,
  sitting_height_2_cm: null,
  sitting_height_3_cm: null,
  leg_length_1_cm_optional: null,
  leg_length_2_cm_optional: null,
  leg_length_3_cm_optional: null,
  weight_1_kg: null,
  weight_2_kg: null,
  weight_3_kg: null,
};

export const baselinesTemplateColumns = {
  date_of_birth_of_player: null,
  gender: null,
  method_for_assessing_mothers_height: null,
  biological_mothers_height_cm: null,
  method_for_assessing_fathers_height: null,
  biological_fathers_height_cm: null,
};

export const benchmarkingTemplateColumns = {
  player_exempt: null,
  player_position: null,
  '05m_sprint': null,
  '10m_sprint': null,
  '20m_sprint': null,
  '30m_sprint': null,
  '505_agility_right': null,
  '505_agility_left': null,
  cmj_optojump: null,
  cmj_vald: null,
  cmj_flight_time: null,
  yo_yo_intermittent_recovery_test_level_1: null,
  yo_yo_intermittent_recovery_test_level_2: null,
  agility_arrow_head_left: null,
  agility_arrow_head_right: null,
};

export const constructIdleLabel = (
  acceptedFileTypes: Array<string>,
  acceptedFilesOverwrite: ?string
) => {
  const instructionString = i18n.t('Drag & drop your files or');
  const browseString = i18n.t('Browse');
  const acceptedFilesString =
    acceptedFilesOverwrite ||
    i18n.t('Accepted file types: {{acceptedFileTypes}}', {
      acceptedFileTypes: acceptedFileTypes.toString(),
    });

  return `${instructionString} <b>${browseString}</b><br /><span class="filepond--label-description">${acceptedFilesString}</span>`;
};
