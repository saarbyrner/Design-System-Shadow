// @flow
import { useState } from 'react';
import type { EventActivityDrillV2 } from '@kitman/common/src/types/Event';
import { fitContentMenuCustomStyles } from '@kitman/components/src/Select';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { ComponentType } from 'react';
import type { Options } from '@kitman/components/src/types';
import type { EventActivityFilterParams } from '@kitman/services/src/services/planning';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ExpandingPanel,
  InputTextField,
  Select,
  TextButton,
  ActivityDrillPanelTranslated,
  TabBar,
} from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import ReactDOM from 'react-dom';
import type { RequestStatus } from '@kitman/modules/src/PlanningEvent/types';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import Tab from './components';
import style from './style';

export type Props = {
  areCoachingPrinciplesEnabled: boolean,
  activityTypes: Array<?Options>,
  addActivity: (number) => void,
  toggleFavorite?: (number) => void | Promise<void>,
  createDrill: Function,
  drillFilters: EventActivityFilterParams,
  drillPrinciples: Array<?Options>,
  drillLibrary: Array<EventActivityDrillV2>,
  isOpen: boolean,
  sortableIdLowerBound?: number,
  requestStatus: RequestStatus,
  staffMembers: Array<?Options>,
  setDrillLibraryFilters: Function,
  getNextDrillLibraryItems: () => void,
  onClose: () => void,
};

const EMPTY_ACTIVITY_NAME = '';

const DrillLibraryPanel = (props: I18nProps<Props>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const delaySearchTermRequest = useDebouncedCallback((enteredText) => {
    props.setDrillLibraryFilters((prev) => ({
      ...prev,
      search_expression: enteredText,
    }));
  }, 600);

  const drillsSortedByActivityType = [...props.drillLibrary]
    .sort((a, b) => {
      const aName = a?.event_activity_type?.name || EMPTY_ACTIVITY_NAME;
      const bName = b?.event_activity_type?.name || EMPTY_ACTIVITY_NAME;
      if (!aName) return 1;
      if (!bName) return -1;
      return aName.localeCompare(bName);
    })
    .map((drill) => {
      const newDrill = { ...drill };
      if (!newDrill.event_activity_type) {
        newDrill.event_activity_type =
          ActivityDrillPanelTranslated.INITIAL_DRILL_ATTRIBUTES.event_activity_type;
      }
      return newDrill;
    });
  const activityTypeNames = [
    ...drillsSortedByActivityType.reduce(
      (names, { event_activity_type: type }) =>
        names.add(type?.name ?? EMPTY_ACTIVITY_NAME),
      new Set()
    ),
  ];

  const favoritedDrillsSortedByActivityType = drillsSortedByActivityType.filter(
    ({ isFavorite }) => isFavorite
  );
  const favoritedActivityTypeNames = [
    ...props.drillLibrary.reduce(
      (names, { event_activity_type: type, isFavorite }) => {
        if (isFavorite) return names.add(type?.name ?? EMPTY_ACTIVITY_NAME);
        return names;
      },
      new Set()
    ),
  ];

  const tabPanes = [
    {
      title: props.t('Squad library'),
      key: 'squad_library',
      content: (
        <Tab
          drills={drillsSortedByActivityType}
          activityTypeNames={activityTypeNames}
          getNextDrillLibraryItems={props.getNextDrillLibraryItems}
          addActivity={props.addActivity}
          toggleFavorite={props.toggleFavorite}
          sortableIdLowerBound={props.sortableIdLowerBound}
          emptyMessage={props.t('No drills in your library yet')}
        />
      ),
    },
    {
      title: props.t('My favourites'),
      key: 'favorites',
      content: (
        <Tab
          drills={favoritedDrillsSortedByActivityType}
          activityTypeNames={favoritedActivityTypeNames}
          getNextDrillLibraryItems={props.getNextDrillLibraryItems}
          addActivity={props.addActivity}
          toggleFavorite={props.toggleFavorite}
          sortableIdLowerBound={props.sortableIdLowerBound}
          emptyMessage={props.t('No drills')}
        />
      ),
    },
  ];

  const renderContent = () => {
    switch (props.requestStatus) {
      case 'LOADING':
        return <DelayedLoadingFeedback />;
      case 'FAILURE':
        return <AppStatus status="error" isEmbed />;
      case 'SUCCESS':
        return (
          <>
            <div css={style.searchInputs}>
              <div css={style.searchBar} data-testid="DrillLibraryPanel|Search">
                <InputTextField
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    delaySearchTermRequest(e.target.value);
                  }}
                  focused
                  autoFocus
                  kitmanDesignSystem
                  placeholder={props.t('Search')}
                />
                <TextButton
                  text={props.t('Create drill')}
                  onClick={props.createDrill}
                  kitmanDesignSystem
                  type="secondary"
                />
              </div>
              <div
                css={style.dropdownFilters(props.areCoachingPrinciplesEnabled)}
              >
                <Select
                  customSelectStyles={fitContentMenuCustomStyles}
                  placeholder={props.t('All creators')}
                  options={props.staffMembers}
                  value={props.drillFilters.user_ids}
                  onChange={(ids) => {
                    props.setDrillLibraryFilters((prev) => {
                      return {
                        ...prev,
                        user_ids: ids,
                      };
                    });
                  }}
                  isMulti
                  appendToBody
                />
                <Select
                  customSelectStyles={fitContentMenuCustomStyles}
                  placeholder={props.t('All activities')}
                  options={props.activityTypes}
                  value={props.drillFilters.event_activity_type_ids}
                  onChange={(ids) => {
                    props.setDrillLibraryFilters((prev) => {
                      return {
                        ...prev,
                        event_activity_type_ids: ids,
                      };
                    });
                  }}
                  isMulti
                  appendToBody
                />
                {props.areCoachingPrinciplesEnabled && (
                  <Select
                    customSelectStyles={style.principlesFilter}
                    placeholder={props.t('All principles')}
                    options={props.drillPrinciples}
                    value={props.drillFilters.principle_ids}
                    onChange={(ids) => {
                      props.setDrillLibraryFilters((prev) => {
                        return {
                          ...prev,
                          principle_ids: ids,
                        };
                      });
                    }}
                    isMulti
                    appendToBody
                  />
                )}
              </div>
            </div>
            <div css={style.tabs}>
              <TabBar
                tabPanes={tabPanes}
                initialTab={tabPanes[0].key}
                kitmanDesignSystem
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return ReactDOM.createPortal(
    <div css={style.drillLibraryPanel} data-testid="Planning|DrillLibraryPanel">
      <ExpandingPanel
        isOpen={props.isOpen}
        title={props.t('Add drill')}
        onClose={props.onClose}
      >
        {renderContent()}
      </ExpandingPanel>
    </div>,
    document.getElementById('planningEvent-Slideout')
  );
};

export const DrillLibraryPanelTranslated: ComponentType<Props> =
  withNamespaces()(DrillLibraryPanel);
export default DrillLibraryPanel;
