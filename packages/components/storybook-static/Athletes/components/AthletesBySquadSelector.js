// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { SquadListTranslated as SquadList } from './SquadList';
import { AthleteListTranslated as AthleteList } from './AthleteList';
import List from './List';
import { SearchResultsTranslated as SearchResults } from './SearchResults';
import type { ID, ItemLeftRenderer, OptionType } from '../types';
import { useSquads } from '../hooks';

type Props = {
  searchValue: string,
  selectedSquadId: ?ID,
  onSquadClick: Function,
  renderItemLeft?: ItemLeftRenderer,
  hiddenTypes?: Array<OptionType>,
  enableAllGroupSelection?: boolean,
  searchAllLevels?: boolean,
  subtitle?: string,
};

function AthletesBySquadSelector(props: Props) {
  const { data: squads } = useSquads();
  const selectedSquadId = useMemo(() => {
    if (squads.length === 1) {
      return squads[0].id;
    }

    return props.selectedSquadId;
  }, [props.selectedSquadId, squads]);

  return (
    <List
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      {props.searchValue === '' ? (
        <>
          {!selectedSquadId && (
            <div
              css={css`
                overflow: auto;
                flex: 1 1 0;
                height: 100%;
              `}
            >
              <SquadList
                selectedSquadId={selectedSquadId}
                onSquadClick={props.onSquadClick}
              />
            </div>
          )}
          {selectedSquadId && (
            <AthleteList
              selectedSquadId={selectedSquadId}
              onClickBack={() => props.onSquadClick(null)}
              renderItemLeft={props.renderItemLeft}
              hiddenTypes={props.hiddenTypes}
              enableAllGroupSelection={props?.enableAllGroupSelection}
              subtitle={props.subtitle}
            />
          )}
        </>
      ) : (
        <SearchResults
          searchValue={props.searchValue}
          hiddenTypes={props.hiddenTypes}
          searchAllLevels={props.searchAllLevels}
          renderItemLeft={props.renderItemLeft}
        />
      )}
    </List>
  );
}

export const AthletesBySquadSelectorTranslated = withNamespaces()(
  AthletesBySquadSelector
);
export default AthletesBySquadSelector;
