// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useEffect } from 'react';
import { Autocomplete } from '@kitman/playbook/components';
import {
  renderInput,
  renderCheckboxes,
} from '@kitman/playbook/utils/Autocomplete';
import { GRID_ROW_FIELD_KEYS as FIELD_KEYS } from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import { inputBackgroundStyle } from '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid/Cells';
import useAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useAthletesIssues';

// Types
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import type { OnUpdateRowCallback } from '@kitman/components/src/DocumentSplitter/src/shared/types';

type Props = {
  params: GridRenderCellParams<any>,
  onUpdateRowCallback: ?OnUpdateRowCallback,
  shouldShowError: boolean,
  shouldDisable: boolean,
};
const IssuesCell = ({
  params,
  onUpdateRowCallback,
  shouldShowError,
  shouldDisable,
}: Props) => {
  const { issueOptions, requestStatus } = useAthletesIssues(
    params.row.player?.id,
    undefined, // excludeGroup
    true // generateIssueOptions
  );
  const disabled = shouldDisable || !params.row.player?.id;

  // Reset the store data for issues if athlete changes
  useEffect(() => {
    onUpdateRowCallback?.({
      rowId: params.id,
      data: { [FIELD_KEYS.associatedIssues]: [] },
    });
  }, [params.id, params.row.player?.id]);

  return (
    <Autocomplete
      multiple
      disabled={disabled}
      disablePortal={false} // Want menu to appear outside of row height bounds
      disableCloseOnSelect
      disableClearable
      limitTags={1}
      fullWidth
      size="small"
      loading={!disabled && requestStatus === 'PENDING'}
      value={params.row.associatedIssues}
      onChange={(e, values) => {
        onUpdateRowCallback?.({
          rowId: params.id,
          data: { [FIELD_KEYS.associatedIssues]: values },
        });
      }}
      options={issueOptions}
      isOptionEqualToValue={(option, value) =>
        option.id === value.id && option.type === value.type
      }
      groupBy={(option) => option.group}
      renderInput={(renderInputParams: Object) =>
        renderInput({
          params: renderInputParams,
          label: i18n.t('Injury/Illness'),
          loading: !disabled && requestStatus === 'PENDING',
          error: shouldShowError,
        })
      }
      renderOption={renderCheckboxes}
      getOptionLabel={(option) => option.label}
      noOptionsText={i18n.t('No issues')}
      sx={inputBackgroundStyle}
    />
  );
};

export default IssuesCell;
