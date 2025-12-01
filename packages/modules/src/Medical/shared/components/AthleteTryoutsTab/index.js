// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  DelayedLoadingFeedback,
  InputTextField,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AthleteTryoutsGrid from './components/AthleteTryoutsGrid';
import useTryoutAthletes from './hooks/useTryoutAthletes';

import { cellStyle, gridStyle, filtersStyle } from '../CommonGridStyle';

type Props = {};

const AthleteTryoutsTab = (props: I18nProps<Props>) => {
  const isForNFL = window.organisationSport === 'nfl';

  const {
    requestStatus,
    onFetchTryoutAthletes,
    grid,
    filteredSearchParams,
    onUpdateFilter,
  } = useTryoutAthletes();

  const title = isForNFL ? props.t('Shared Players') : props.t('Tryout');

  const renderFilters = () => {
    return (
      <div css={filtersStyle.wrapper}>
        <div css={filtersStyle.filter}>
          <InputTextField
            kitmanDesignSystem
            onChange={(event) =>
              onUpdateFilter({
                athlete_name: event.target.value,
              })
            }
            placeholder={props.t('Search athletes')}
            searchIcon
            value={filteredSearchParams?.athlete_name}
          />
        </div>
      </div>
    );
  };

  const renderTitle = () => {
    return (
      <div css={cellStyle.titleContainer}>
        <h3 css={cellStyle.title}>{title}</h3>
      </div>
    );
  };

  const renderContent = () => {
    switch (requestStatus) {
      case 'PENDING':
        return <DelayedLoadingFeedback />;
      case 'FAILURE':
        return <AppStatus status="error" />;
      default:
        return (
          <AthleteTryoutsGrid
            fetchMoreData={onFetchTryoutAthletes}
            grid={{
              columns: grid.columns,
              rows: grid.rows,
            }}
            gridId={grid.id}
            emptyTableText={grid.emptyTableText}
            isLoading={requestStatus === 'PENDING'}
          />
        );
    }
  };

  return (
    <div css={gridStyle.wrapper}>
      <header css={cellStyle.header}>
        {renderTitle()}
        {renderFilters()}
      </header>
      {renderContent()}
    </div>
  );
};

export const AthleteTryoutsTabTranslated: ComponentType<Props> =
  withNamespaces()(AthleteTryoutsTab);
export default AthleteTryoutsTab;
