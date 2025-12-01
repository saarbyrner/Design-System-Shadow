// @flow
import { useState } from 'react';
import _flatten from 'lodash/flatten';
import { withNamespaces } from 'react-i18next';
import { breakPoints } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import debounce from 'lodash/debounce';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import {
  InputText,
  Select,
  TextButton,
  SlidingPanelResponsive,
} from '@kitman/components';
import {
  getAvailabilityList,
  getIssueList,
} from '@kitman/common/src/utils/workload';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RosterFilters } from '../../../../types';
import {
  useGetPermittedSquadsQuery,
  useGetPositionGroupsQuery,
} from '../../../../../shared/redux/services/medical';

const style = {
  filters: css`
    display: flex;
    z-index: 4;
  `,
  'filters--desktop': css`
    gap: 5px;

    @media (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  'filters--mobile': css`
    gap: 5px;

    button {
      margin-bottom: 8px;
    }

    @media (min-width: ${breakPoints.desktop}) {
      display: none;
    }

    @media (max-width: ${breakPoints.tablet}) {
      align-items: flex-start;
      flex-direction: column;
    }
  `,
  filtersPanel: css`
    padding-left: 25px;
    padding-right: 25px;
  `,
  filter: css`
    @media (min-width: ${breakPoints.desktop}) {
      min-width: 180px;

      .inputText {
        width: 240px;
      }
    }

    @media (max-width: ${breakPoints.desktop}) {
      display: block;
      margin-bottom: 10px;
      width: 100%;
    }
  `,
};

type Props = {
  filters: RosterFilters,
  onUpdateFilters: Function,
  isDisabled: boolean,
};

const Filters = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (value) =>
    props.onUpdateFilters({
      athlete_name: value,
    });

  const debounceHandleSearch = debounce(handleSearch, 1000);

  const { data: squads, isLoading: isSquadsLoading } =
    useGetPermittedSquadsQuery(undefined, { skip: props.isDisabled });

  const { data: positions, isLoading: isPositionsLoading } =
    useGetPositionGroupsQuery(undefined, { skip: props.isDisabled });

  const renderSearchFilter = () => {
    return (
      <div css={style.filter}>
        <InputText
          data-testid="Filters|SearchBar"
          kitmanDesignSystem
          onValidation={({ value }) => debounceHandleSearch(value)}
          placeholder={props.t('Search athletes')}
          searchIcon
          value={props.filters.athlete_name}
          disabled={props.isDisabled}
        />
      </div>
    );
  };

  const renderSquadFilter = () => {
    const squadOptions =
      squads?.map((squad) => ({
        value: squad.id,
        label: squad.name,
      })) || [];
    return (
      <div css={style.filter}>
        <Select
          appendToBody
          data-testid="Filters|SquadSelect"
          options={squadOptions}
          onChange={(selectedItems) =>
            props.onUpdateFilters({
              squads: selectedItems,
            })
          }
          value={props.filters.squads}
          placeholder={props.t('Squad')}
          isMulti
          isDisabled={isSquadsLoading || props.isDisabled}
          inlineShownSelection
        />
      </div>
    );
  };

  const renderPositionFilter = () => {
    const positionsOptions =
      (positions &&
        _flatten(positions.map((positionGroup) => positionGroup.positions)).map(
          (position) => ({
            value: position.id,
            label: position.name,
          })
        )) ||
      [];

    return (
      <div css={style.filter}>
        <Select
          appendToBody
          data-testid="Filters|PositionSelect"
          options={positionsOptions}
          onChange={(selectedItems) =>
            props.onUpdateFilters({
              positions: selectedItems,
            })
          }
          value={props.filters.positions}
          placeholder={props.t('Position')}
          isDisabled={isPositionsLoading || props.isDisabled}
          isMulti
          inlineShownSelection
        />
      </div>
    );
  };

  const renderAvailabilityFilter = () => {
    if (
      window.featureFlags['availability-info-disabled'] ||
      !permissions.medical.availability.canView
    )
      return null;

    const availabilityOptions = defaultMapToOptions(getAvailabilityList());

    return (
      <div css={style.filter}>
        <Select
          appendToBody
          data-testid="Filters|AvailabilitySelect"
          options={availabilityOptions}
          onChange={(selectedItems) =>
            props.onUpdateFilters({
              availabilities: selectedItems,
            })
          }
          value={props.filters.availabilities}
          placeholder={props.t('Availability')}
          isMulti
          isDisabled={props.isDisabled}
          showAutoWidthDropdown
          inlineShownSelection
        />
      </div>
    );
  };

  const renderIssueFilter = () => {
    if (!window.featureFlags['injured-filter-on-roster-page']) return null;

    const issueOptions = defaultMapToOptions(getIssueList());

    return (
      <div css={style.filter}>
        <Select
          appendToBody
          data-testid="Filters|IssueSelect"
          options={issueOptions}
          onChange={(selectedItems) =>
            props.onUpdateFilters({
              issues: selectedItems,
            })
          }
          value={props.filters.issues}
          placeholder={props.t('Injured')}
          isMulti
          isDisabled={props.isDisabled}
          showAutoWidthDropdown
          inlineShownSelection
        />
      </div>
    );
  };

  return (
    <>
      <div
        css={[style.filters, style['filters--mobile']]}
        data-testid="Filters|MobileFilters"
      >
        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setShowFilterPanel(true)}
          kitmanDesignSystem
        />

        <SlidingPanelResponsive
          isOpen={showFilterPanel}
          title={props.t('Filters')}
          onClose={() => setShowFilterPanel(false)}
        >
          <div css={style.filtersPanel}>
            {renderSearchFilter()}
            {renderSquadFilter()}
            {renderPositionFilter()}
            {renderAvailabilityFilter()}
            {renderIssueFilter()}
          </div>
        </SlidingPanelResponsive>
      </div>
      <div
        css={[style.filters, style['filters--desktop']]}
        data-testid="Filters|DesktopFilters"
      >
        {renderSearchFilter()}
        {renderSquadFilter()}
        {renderPositionFilter()}
        {renderAvailabilityFilter()}
        {renderIssueFilter()}
      </div>
    </>
  );
};

export const FiltersTranslated = withNamespaces()(Filters);
export default Filters;
