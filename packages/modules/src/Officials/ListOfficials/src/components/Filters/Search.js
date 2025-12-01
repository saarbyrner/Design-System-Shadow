// @flow
import i18n from '@kitman/common/src/utils/i18n';

import { InputTextField } from '@kitman/components';

import { filtersStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle';

type Props = {
  onUpdateFunction: Function,
  searchKey: string,
  value: string,
};
const Search = (props: Props) => {
  return (
    <div css={filtersStyle.filter}>
      <InputTextField
        kitmanDesignSystem
        onChange={(event) =>
          props.onUpdateFunction({
            [props.searchKey]: event.target.value,
          })
        }
        placeholder={i18n.t('Search')}
        searchIcon
        value={props.value}
      />
    </div>
  );
};

export default Search;
