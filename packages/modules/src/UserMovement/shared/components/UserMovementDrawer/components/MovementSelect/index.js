// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { zIndices } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@kitman/playbook/components';
import { getPermissionGroupFactory } from '@kitman/common/src/redux/global/selectors';
import { VIEW } from '@kitman/modules/src/UserMovement/shared/constants/index';
import getMovementType from './getMovementType';
import type { Mode } from '../../../../types';
import FormItem from '../FormItem';

type Props = {
  value: string,
  onUpdate: Function,
  mode: Mode,
  isPastPlayer?: boolean,
};

const MovementSelect = (props: I18nProps<Props>) => {
  const { isAssociationAdmin } = useLeagueOperations();
  const userMovementPermissions = useSelector(
    getPermissionGroupFactory('userMovement')
  );

  const movementTypeOptions = getMovementType({
    isAssociationAdmin,
    userMovementPermissions,
    isPastPlayer: props.isPastPlayer,
  });

  if (props.mode === VIEW) {
    const selected = movementTypeOptions.find(
      (option) => option.value === props.value
    );
    return (
      <FormItem
        primary={props.t('Type of movement')}
        secondary={selected?.label || '-'}
      />
    );
  }
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="movement-type-label">
        {props.t('Type of movement')}
      </InputLabel>
      <Select
        id="movement-type-select"
        label={props.t('Type of movement')}
        labelId="movement-type-label"
        value={props.value || ''}
        MenuProps={{
          style: { zIndex: zIndices.drawer },
        }}
        onChange={(e) => props.onUpdate(e.target.value)}
      >
        {movementTypeOptions.map((option) => {
          return (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export const MovementSelectTranslated = withNamespaces()(MovementSelect);
export default MovementSelect;
