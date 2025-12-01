// @flow
import type { ComponentType, Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useState } from 'react';
import { InputTextField } from '@kitman/components';
import { css } from '@emotion/react';

type ChildArgs = {
  searchValue: string,
  setSearchValue: (newValue: string) => void,
};

type Props = {
  children: (childArgs: ChildArgs) => Node,
  isInAthleteSelect?: boolean,
};

function SearchBoxWrapper({
  children,
  isInAthleteSelect,
  t,
}: I18nProps<Props>) {
  const [searchValue, setSearchValue] = useState('');
  return (
    <>
      <InputTextField
        data-testid="ExtendedPopulationSelector|SearchInput"
        placeholder={t('Search')}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        inputType="text"
        searchIcon
        kitmanDesignSystem
        autoFocus
      />
      <div
        css={
          isInAthleteSelect
            ? css`
                height: 300px;
                min-width: 300px;
                overflow: auto;
              `
            : css`
                height: 100%;
                overflow: auto;
              `
        }
      >
        {children({ searchValue, setSearchValue })}
      </div>
    </>
  );
}

export const SearchBoxWrapperTranslated: ComponentType<Props> =
  withNamespaces()(SearchBoxWrapper);
export default SearchBoxWrapper;
