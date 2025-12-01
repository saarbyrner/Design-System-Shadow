// @flow
import { type Node } from 'react';
import { type SetState } from '@kitman/common/src/types/react';
import {
  type ParseState,
  type UserTypes,
} from '@kitman/modules/src/shared/MassUpload/types';
import { type AttachedFile } from '@kitman/common/src/utils/fileHelper';

export type Column = {
  id: string,
  row_key: string,
  content: $ReadOnly<{
    props: {
      title: ?string,
    },
  }>,
};

type DataCell = {
  id: string,
  content: any,
};

export type Row = {
  id: number | string,
  cells: Array<DataCell>,
  classnames: {
    is__error: boolean,
  },
};

export type GridConfig = {
  rows: Array<Row>,
  columns: Array<Column>,
  emptyTableText: string,
  id: string,
};

export type UseGrid = {
  grid: GridConfig,
  ruleset: Node,
  isLoading: boolean,
  isError: boolean,
};

export type UseGridData = {
  parsedCsv: Array<{ [key: string]: string }>,
  userType?: UserTypes,
  file?: File,
  source?: string,
  setParseState?: (ParseState) => void,
  setCustomErrors?: ({ errors: Array<string>, isSuccess: boolean }) => void,
  activeStep?: number,
  setHasFilePondProcessed?: SetState<boolean>,
};

export type ToggleOptions = 'all' | 'valid' | 'invalid';

export type ImportConfig = $Exact<{
  grid: (data: UseGridData) => UseGrid,
  expectedHeaders: Array<string>,
  allowAdditionalHeaders?: boolean,
  redirectUrl: string,
  enabled: boolean,
  optionalExpectedHeaders?: Array<string>,
  customSteps?: Array<{ title: string, caption: string }>,
  canImportWithErrors?: boolean,
  customImportService?: (any) => Promise<any>,
}>;

type DataTypeGuideline = {
  label: string,
  acceptedValues: Array<string>,
  isRequired?: boolean,
  caseInsensitive?: boolean,
  key?: string,
};

export type DataTypeGuidelines = Array<DataTypeGuideline>;

export type BaselinesCSV = {
  athlete_id: string,
  athlete_first_name: string,
  athlete_last_name: string,
  date_of_birth_of_player: string,
  gender: string,
  method_for_assessing_mothers_height: string,
  biological_mothers_height_cm: string,
  method_for_assessing_fathers_height: string,
  biological_fathers_height_cm: string,
};

export type LeagueBenchmarkingCSV = {
  athlete_id: string,
  athlete_first_name: string,
  athlete_last_name: string,
  date_of_test: string,
  player_exempt: string,
  player_position: string,
  '05m_sprint': string,
  '10m_sprint': string,
  '20m_sprint': string,
  '30m_sprint': string,
  '505_agility_right': string,
  '505_agility_left': string,
  cmj_optojump: string,
  cmj_vald: string,
  cmj_flight_time: string,
  yo_yo_intermittent_recovery_test_level_1: string,
  yo_yo_intermittent_recovery_test_level_2: string,
  agility_arrow_head_left: string,
  agility_arrow_head_right: string,
};

export type GrowthAndMaturationCSV = {
  athlete_id: string,
  athlete_first_name: string,
  athlete_last_name: string,
  date_measured: string,
  measured_by_user_id_optional: string,
  head_attire_worn: string,
  standing_height_1_cm: string,
  standing_height_2_cm: string,
  standing_height_3_cm: string,
  box_height_cm: string,
  sitting_height_1_cm: string,
  sitting_height_2_cm: string,
  sitting_height_3_cm: string,
  leg_length_1_cm_optional: string,
  leg_length_2_cm_optional: string,
  leg_length_3_cm_optional: string,
  weight_1_kg: string,
  weight_2_kg: string,
  weight_3_kg: string,
};

export type TrainingVariablesAnswerCSV = {
  athlete_id: string,
  athlete_first_name: string,
  athlete_last_name: string,
  date_measured: string,
  measured_by_user_id_optional: string,
  head_attire_worn: string,
  standing_height_1_cm: string,
  standing_height_2_cm: string,
  standing_height_3_cm: string,
  box_height_cm: string,
  sitting_height_1_cm: string,
  sitting_height_2_cm: string,
  sitting_height_3_cm: string,
  leg_length_1_cm_optional: string,
  leg_length_2_cm_optional: string,
  leg_length_3_cm_optional: string,
  weight_1_kg: string,
  weight_2_kg: string,
  weight_3_kg: string,
};

export type KitMatrixCSV = {
  type: string,
  club: string,
  season: string,
  kit_name: string,
  kit_color: string,
  jersey_color: string,
  jersey_url: string,
  shorts_color: string,
  shorts_url: string,
  socks_color: string,
  socks_url: string,
};

export type MassUploadCSVs =
  | LeagueBenchmarkingCSV
  | BaselinesCSV
  | GrowthAndMaturationCSV;

export type Validation = {
  [key: string]: Function,
  athlete?: MassUploadCSVs,
};

export type VendorOption = { id: string, label: string };

export type AttachedFileOrFilePondLike =
  | ?AttachedFile
  | {
      file: File,
      fileSize: number,
      filename: string,
      id: number,
    };
