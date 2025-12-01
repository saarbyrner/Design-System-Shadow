// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  FormControl,
  Autocomplete,
  TextField,
  MenuItem,
  Avatar,
  Typography,
  Stack,
  Popper,
} from '@kitman/playbook/components';
import { styled } from '@mui/material/styles';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import MovementDirection from '../MovementDirection';
import type { Mode, MovementType } from '../../../../types';

import { getMovementConfirmationLabel } from '../../config';
import { VIEW } from '../../../../constants';

type Props = {
  type: MovementType,
  options: Array<Object>,
  value: string,
  selectedOrganisation: Organisation,
  currentOrganisation: Organisation,
  mode: Mode,
  onUpdate: Function,
};

const OrganisationSelect = (props: I18nProps<Props>) => {
  if (props.mode === VIEW) {
    return (
      <MovementDirection
        label={getMovementConfirmationLabel({ type: props.type })}
        fromOrganisation={props.currentOrganisation}
        toOrganisation={props.selectedOrganisation}
      />
    );
  }

  const renderOrganisationRow = (organisation: Organisation) => {
    if (!organisation) return null;

    return (
      <Stack direction="row" spacing={2} sx={{ py: 1 }}>
        <Avatar
          sx={{ width: 24, height: 24 }}
          alt={organisation.name}
          src={organisation.logo_full_path}
        />
        <Typography
          variant="body2"
          component="div"
          sx={{ color: 'text.primary' }}
        >
          {organisation.name}
        </Typography>
      </Stack>
    );
  };

  const StyledPopper = styled(Popper)({
    paddingLeft: 20,
    paddingTop: 1,
  });

  // this is so we render the label when we have no value, and if a value is in state then show that value
  const getValue = () => {
    const getInitValue = () =>
      props.options.find((item) => item.id === props.value) || null;

    return props.value ? { value: getInitValue() } : { value: null };
  };

  return (
    <FormControl fullWidth size="small">
      <Autocomplete
        {...getValue()}
        disablePortal
        id="combo-box-demo"
        options={props.options}
        getOptionLabel={(options) => options.name}
        onChange={(_, value) => {
          if (props.value) {
            // this will invalidate the form and disable the next button
            return props.onUpdate([]);
          }
          return value ? props.onUpdate([value.id]) : null;
        }}
        ListboxProps={{
          style: { maxHeight: 450, overflow: 'auto', boxShadow: 2 },
        }}
        renderOption={(renderOptionProps, option) => {
          return (
            <MenuItem
              {...renderOptionProps}
              key={renderOptionProps['data-option-index']}
            >
              {renderOrganisationRow(option)}
            </MenuItem>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={props.t('Medical trial with')}
          />
        )}
        PopperComponent={StyledPopper}
      />
    </FormControl>
  );
};

export const OrganisationSelectTranslated =
  withNamespaces()(OrganisationSelect);
export default OrganisationSelect;
