// @flow
import { styled } from '@mui/material/styles';
import { Popper, TextField } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { CreateMovementState } from '../types';

// I'm trying to extract as much shared functionality for the autocomplete components
// I already tried making a shared component, but this was proving to be a horrible pattern
// and difficult to scale
// I think this way is better as it is cleaner and provides more clarity on how each component behaves

export const getValueForField = (
  options: Array<Object>,
  key: string | number
) => {
  const getStateValue = () => options?.find((item) => item.id === key) || null;

  return key ? getStateValue() : null;
};

export const sharedAutoCompleteOverrides = {
  baseProps: {
    '.MuiInputBase-root': {
      background: colors.neutral_200,
      borderRadius: '3px',
    },
  },
  listProps: {
    style: { maxHeight: 250, overflow: 'auto', boxShadow: 2 },
  },
  popper: styled(Popper)({
    paddingLeft: 8,
    paddingTop: 1,
  }),
};

export const renderAutocompleteInput = ({
  inputParams,
  getHelperText,
  isError = false,
}: {
  inputParams: Object,
  getHelperText: Function,
  isError?: boolean,
}) => {
  return (
    <TextField
      {...inputParams}
      fullWidth
      variant="outlined"
      error={isError}
      helperText={getHelperText()}
    />
  );
};

export const initialState: CreateMovementState = {
  drawer: {
    isOpen: false,
  },
  modal: {
    isOpen: false,
  },
  form: {
    user_id: null,
    transfer_type: null,
    join_organisation_ids: [],
    join_squad_ids: [],
    leave_organisation_ids: [],
    joined_at: moment().format(dateTransferFormat),
  },
  validation: {
    join_organisation_ids: {
      status: 'PENDING',
      message: null,
    },
    join_squad_ids: {
      status: 'PENDING',
      message: null,
    },
    leave_organisation_ids: {
      status: 'PENDING',
      message: null,
    },
  },
};
