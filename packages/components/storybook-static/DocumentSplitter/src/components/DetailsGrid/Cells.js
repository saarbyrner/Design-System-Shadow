// @flow
import { memo, type Node } from 'react';
import moment from 'moment';

import i18n from '@kitman/common/src/utils/i18n';
import {
  Autocomplete,
  GridActionsCellItem,
  TextField,
} from '@kitman/playbook/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { colors } from '@kitman/common/src/variables';
import {
  renderInput,
  renderCheckboxes,
} from '@kitman/playbook/utils/Autocomplete';
import { sanitizeDate } from '@kitman/playbook/utils/DatePicker';
import { GRID_ROW_FIELD_KEYS as FIELD_KEYS } from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import { AthleteSelectorTranslated as AthleteSelector } from '@kitman/modules/src/Medical/shared/components/AthleteSelector';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import type { Option } from '@kitman/playbook/types';
import type {
  DetailsGridRowDataPartial,
  GridRowDataKey,
  OnUpdateRowCallback,
  OnDeleteRowCallback,
} from '@kitman/components/src/DocumentSplitter/src/shared/types';

const buildCellContent = ({
  id,
  field,
  splitDetails,
  onUpdateRowCallback,
  shouldShowError,
  shouldDisable,
}: {
  id: number,
  field: GridRowDataKey,
  splitDetails: DetailsGridRowDataPartial,
  onUpdateRowCallback: ?OnUpdateRowCallback,
  shouldShowError: boolean,
  shouldDisable: boolean,
}): Node | Array<Node> => {
  switch (field) {
    case FIELD_KEYS.pages: {
      return (
        <PagesCellEditor
          id={id}
          value={splitDetails[FIELD_KEYS.pages] || ''}
          onUpdateRowCallback={onUpdateRowCallback}
          shouldShowError={shouldShowError}
          shouldDisable={shouldDisable}
        />
      );
    }
    case FIELD_KEYS.dateOfDocument: {
      const enteredDate = splitDetails[FIELD_KEYS.dateOfDocument];
      return (
        <MovementAwareDatePicker
          athleteId={Number(splitDetails[FIELD_KEYS.player]?.id)}
          value={enteredDate ? moment(enteredDate) : null}
          onChange={(date, context) => {
            onUpdateRowCallback?.({
              rowId: id,
              data: {
                [FIELD_KEYS.dateOfDocument]: sanitizeDate(date),
                [FIELD_KEYS.hasConstraintsError]: !!context.validationError,
              },
            });
          }}
          onError={(error) => {
            onUpdateRowCallback?.({
              rowId: id,
              data: {
                [FIELD_KEYS.hasConstraintsError]: !!error,
              },
            });
          }}
          disabled={!splitDetails[FIELD_KEYS.player]?.id}
          isInvalid={shouldShowError}
          clearable
          disableFuture
        />
      );
    }
    case FIELD_KEYS.fileName: {
      return (
        <FileNameCellEditor
          id={id}
          value={splitDetails[FIELD_KEYS.fileName] || ''}
          onUpdateRowCallback={onUpdateRowCallback}
          shouldShowError={shouldShowError}
          shouldDisable={shouldDisable}
        />
      );
    }
    default:
      // Other cells have more custom renders like renderPlayerSelect and renderCategoriesSelect
      return null;
  }
};

type PagesCellEditorProps = {
  id: number,
  value: string,
  onUpdateRowCallback: ?OnUpdateRowCallback,
  shouldShowError: boolean,
  shouldDisable: boolean,
};

export const PagesCellEditor = memo<PagesCellEditorProps>(
  ({
    id,
    value,
    onUpdateRowCallback,
    shouldShowError,
    shouldDisable,
  }: PagesCellEditorProps) => {
    return (
      <TextField
        label={i18n.t('Pages')}
        value={value}
        onChange={(e) => {
          onUpdateRowCallback?.({
            rowId: id,
            data: { [FIELD_KEYS.pages]: e.target.value },
          });
        }}
        fullWidth
        error={shouldShowError}
        margin="none"
        disabled={shouldDisable}
      />
    );
  }
);

type FileNameCellEditorProps = {
  id: number,
  value: string,
  onUpdateRowCallback: ?OnUpdateRowCallback,
  shouldShowError: boolean,
  shouldDisable: boolean,
};

export const FileNameCellEditor = memo<FileNameCellEditorProps>(
  ({
    id,
    value,
    onUpdateRowCallback,
    shouldShowError,
    shouldDisable,
  }: FileNameCellEditorProps) => {
    return (
      <TextField
        label={i18n.t('File name')}
        value={value}
        onKeyDown={(event) => {
          event.stopPropagation();
        }}
        onChange={(e) => {
          onUpdateRowCallback?.({
            rowId: id,
            data: { [FIELD_KEYS.fileName]: e.target.value },
          });
        }}
        fullWidth
        error={shouldShowError}
        margin="none"
        disabled={shouldDisable}
      />
    );
  }
);

export const renderCell = (
  params: GridRenderCellParams<any>,
  onUpdateRowCallback: ?OnUpdateRowCallback,
  shouldShowError: boolean,
  shouldDisable: boolean
) =>
  buildCellContent({
    id: params.id,
    field: params.field,
    splitDetails: params.row,
    onUpdateRowCallback,
    shouldShowError,
    shouldDisable,
  });

export const inputBackgroundStyle = {
  '.MuiInputBase-root': {
    background: colors.neutral_200,
    borderRadius: '3px',
  },
};

export const renderPlayerSelect = (
  params: GridRenderCellParams<any>,
  onUpdateRowCallback: ?OnUpdateRowCallback,
  players: Array<Option>,
  shouldShowLoading: boolean,
  shouldShowError: boolean,
  shouldDisable: boolean
) => (
  <AthleteSelector
    label={i18n.t('Player')}
    value={params.row.player || null}
    onChange={(value: Option) => {
      onUpdateRowCallback?.({
        rowId: params.id,
        data: { [FIELD_KEYS.player]: value },
      });
    }}
    fullWidth
    disabled={shouldDisable}
    error={shouldShowError}
    sx={inputBackgroundStyle}
  />
);

export const renderCategoriesSelect = (
  params: GridRenderCellParams<any>,
  onUpdateRowCallback: ?OnUpdateRowCallback,
  categories: Array<Option>,
  shouldShowLoading: boolean,
  shouldShowError: boolean,
  shouldDisable: boolean
) => (
  <Autocomplete
    multiple
    disabled={shouldDisable}
    disablePortal={false} // Want menu to appear outside of row height bounds
    disableCloseOnSelect
    limitTags={1}
    fullWidth
    size="small"
    disableClearable
    loading={shouldShowLoading}
    value={params.row.categories}
    onChange={(e, values) => {
      onUpdateRowCallback?.({
        rowId: params.id,
        data: { [FIELD_KEYS.categories]: values },
      });
    }}
    options={categories}
    isOptionEqualToValue={(option, value) => option.id === value.id}
    groupBy={(option) => option.group}
    renderInput={(renderInputParams: Object) =>
      renderInput({
        params: renderInputParams,
        label: i18n.t('Categories'),
        loading: shouldShowLoading,
        error: shouldShowError,
      })
    }
    renderOption={renderCheckboxes}
    getOptionLabel={(option) => option.label}
    noOptionsText={i18n.t('No categories')}
    sx={inputBackgroundStyle}
  />
);

export const renderActions = (
  params: GridRenderCellParams<any>,
  onDeleteRowCallback: OnDeleteRowCallback,
  shouldDisable: boolean
) => [
  <GridActionsCellItem
    key="delete"
    disabled={shouldDisable}
    icon={<KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />}
    label="Delete"
    onClick={() => {
      onDeleteRowCallback({ rowId: params.id });
    }}
  />,
];
