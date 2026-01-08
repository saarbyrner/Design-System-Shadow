// @flow
import { withNamespaces } from 'react-i18next';
import { GroupedVirtuoso } from 'react-virtuoso';
import { colors } from '@kitman/common/src/variables';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useOptions, useOptionSelect, useAthleteContext } from '../hooks';
import type {
  ID,
  ItemLeftRenderer,
  SelectorOption,
  OptionType,
} from '../types';
import List from './List';
import Avatar from './Avatar';
import Checkbox from '../../Checkbox';

type Props = {
  searchValue: string,
  searchAllLevels?: boolean,
  hiddenTypes?: Array<OptionType>,
  renderItemLeft?: ItemLeftRenderer,
};

function SearchResults(props: I18nProps<Props>) {
  const evaluateHiddenTypes = props?.searchAllLevels
    ? props?.hiddenTypes
    : ['positions', 'position_groups'];
  const { data: squads } = useOptions({
    searchText: props.searchValue,
    hiddenTypes: evaluateHiddenTypes,
    groupBy: 'squad',
  });
  const { onClick, isSelected } = useOptionSelect();
  const { isMulti } = useAthleteContext();

  const renderLeftFactory = (option: SelectorOption, squadId: ID) => () => {
    if (isMulti) {
      return (
        <Checkbox
          id={`${option.type}|${option.id}`}
          isChecked={isSelected(option.id, option.type, squadId)}
          toggle={() => onClick(option.id, option.type, squadId)}
          kitmanDesignSystem
        />
      );
    }

    if (typeof props.renderItemLeft === 'function') {
      return props.renderItemLeft(option);
    }

    return (
      <Avatar
        type={option.type}
        firstname={option.firstname}
        lastname={option.lastname}
        url={option.avatar_url}
      />
    );
  };

  const fullOptions = [
    ...squads.flatMap(({ id, options }) => [
      ...options.map((option) => ({
        ...option,
        squadId: id,
      })),
    ]),
  ];

  return (
    <>
      {squads.length > 0 && (
        <GroupedVirtuoso
          data-testid="SearchResults|Virtuoso"
          components={{
            Header: () => (
              <List.GroupHeading title={props.t('Search results')} />
            ),
          }}
          style={{ width: '100%', height: '100%' }}
          groupCounts={squads.map(({ options }) => options.length)}
          groupContent={(index) => {
            const squad = squads[index];

            return (
              <List.GroupHeading
                key={squad.name}
                title={squad.name}
                styles={{
                  heading: {
                    borderBottom: 'none',
                  },
                }}
                isSticky
              />
            );
          }}
          itemContent={(index) => {
            const option = fullOptions[index];

            return (
              <List.Option
                key={option.id}
                title={option.name}
                renderLeft={renderLeftFactory(option, option.squadId)}
                subTitle={
                  option.type !== 'athletes'
                    ? `(${props.t('Group')})`
                    : option.position?.name
                }
                onClick={() => onClick(option.id, option.type, option.squadId)}
              />
            );
          }}
        />
      )}

      {squads.length === 0 && props.searchValue !== '' && (
        <div
          css={{
            padding: '24px 16px',
            color: colors.grey_300,
            fontSize: '12px',
          }}
        >
          {props.t('No search results')}
        </div>
      )}
    </>
  );
}

export const SearchResultsTranslated = withNamespaces()(SearchResults);
export default SearchResults;
