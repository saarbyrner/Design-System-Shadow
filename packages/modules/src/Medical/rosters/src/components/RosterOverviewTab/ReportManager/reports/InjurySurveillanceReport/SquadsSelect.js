// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetPermittedSquadsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import type { Squad } from '@kitman/services/src/services/getPermittedSquads';

import { Autocomplete, TextField } from '@kitman/playbook/components';
import { renderCheckboxes } from '@kitman/playbook/utils/Autocomplete';

type Props = {
  onChange: Function,
  selectedSquads: Array<Squad>,
};

const SquadsSelect = ({ t, onChange, selectedSquads }: I18nProps<Props>) => {
  const {
    data: squadData = [],
    isFetching,
    isError,
  } = useGetPermittedSquadsQuery();

  return (
    <Autocomplete
      id="squad-select"
      multiple
      disableCloseOnSelect
      size="small"
      value={selectedSquads}
      onChange={(_, value) => {
        onChange(value);
      }}
      options={squadData.map(({ id, name }) => ({ id, label: name }))}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      disabled={isFetching || isError}
      renderOption={renderCheckboxes}
      renderInput={(params) => <TextField {...params} label={t('Squads')} />}
    />
  );
};

export const SquadsSelectTranslated: ComponentType<Props> =
  withNamespaces()(SquadsSelect);
export default SquadsSelect;
