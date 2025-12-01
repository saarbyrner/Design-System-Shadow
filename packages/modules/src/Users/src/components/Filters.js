// @flow
import { useSelector, useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { InputTextField } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getSearchText } from '../redux/selectors';
import { setSearchText } from '../redux/actions';

const styles = {
  filters: css`
    margin-bottom: 16px;
  `,
  search: css`
    width: 240px;
  `,
};

type Props = {};

function Filters(props: I18nProps<Props>) {
  const dispatch = useDispatch();
  const searchText = useSelector(getSearchText);

  const setSearch = (text) => {
    dispatch(setSearchText(text));
  };

  return (
    <div css={styles.filters}>
      <div css={styles.search}>
        <InputTextField
          placeholder={props.t('Search')}
          value={searchText}
          onChange={(e) => setSearch(e.target.value)}
          searchIcon
          kitmanDesignSystem
        />
      </div>
    </div>
  );
}

export const FiltersTranslated = withNamespaces()(Filters);
export default Filters;
