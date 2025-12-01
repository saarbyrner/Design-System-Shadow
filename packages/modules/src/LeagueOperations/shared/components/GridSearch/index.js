// @flow
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { extraSmallIconSize } from '@kitman/playbook/icons/consts';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { TextField, InputAdornment } from '@kitman/playbook/components';
import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';

type Props = {
  value: string,
  onUpdate: Function,
  requestStatus: RequestStatus,
  sx?: Object,
};

const GridSearch = (props: I18nProps<Props>) => {
  const isDisabled =
    props.requestStatus.isFetching ||
    props.requestStatus.isLoading ||
    props.requestStatus.isError;

  return (
    <TextField
      value={props.value}
      onChange={(event) => props.onUpdate(event.target.value)}
      size="small"
      label={props.t('Search')}
      sx={{ m: 1, width: 300, ...(props?.sx ?? {}) }}
      disabled={isDisabled}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <KitmanIcon
              name={KITMAN_ICON_NAMES.Search}
              fontSize={extraSmallIconSize}
            />
          </InputAdornment>
        ),
      }}
      variant="filled"
    />
  );
};

export const GridSearchTranslated = withNamespaces()(GridSearch);
export default GridSearch;
