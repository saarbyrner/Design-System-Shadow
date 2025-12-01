// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  DateRangePicker,
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { ADD_TREATMENT_BUTTON } from '@kitman/modules/src/Medical/shared/constants/elementTags';

import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import { convertDateRangeToTuple } from '@kitman/playbook/components/wrappers/CustomDateRangePicker/utils';
import style from '@kitman/modules/src/Medical/shared/components/styles/filters';

import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  RequestStatus,
  TreatmentFilter,
} from '@kitman/modules/src/Medical/shared/types';
import type { SelectOption as Option } from '@kitman/components/src/types';

type Props = {
  filter: TreatmentFilter,
  canSelectAthlete: boolean,
  isReviewMode: boolean,
  isExporting: boolean,
  showDownloadTreatments: boolean,
  squadAthletes: Array<Option>,
  squads: Array<Option>,
  onChangeFilter: (filter: TreatmentFilter) => void,
  onClickAddTreatment: Function,
  onClickCancelReviewing: Function,
  onClickDownloadTreatment: Function,
  onClickSaveReviewing: Function,
  onClickExportRosterBilling: Function,
  onClickRemoveAllModalities: Function,
  initialDataRequestStatus: RequestStatus,
  hiddenFilters?: Array<string>,
};

const TreatmentFilters = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [isFilterPanelShown, setIsFilterPanelShown] = useState(false);

  const renderSearchFilter = (
    <div css={style.filter}>
      <InputTextField
        data-testid="TreatmentFilters|Search"
        placeholder={props.t('Search')}
        value={props.filter.search_expression}
        onChange={({ target: { value } }) =>
          props.onChangeFilter({
            ...props.filter,
            search_expression: value,
          })
        }
        searchIcon
        kitmanDesignSystem
        disabled={props.initialDataRequestStatus === 'PENDING'}
      />
    </div>
  );

  const renderPlayerFilter = (
    <div css={style.filter}>
      <Select
        data-testid="TreatmentFilters|PlayerSelect"
        placeholder={props.t('Player')}
        value={props.filter.athlete_id}
        options={props.squadAthletes}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filter,
            athlete_id: id,
          })
        }
        isClearable
        onClear={() =>
          props.onChangeFilter({
            ...props.filter,
            athlete_id: null,
          })
        }
        showAutoWidthDropdown
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
      />
    </div>
  );

  const renderDateFilter = () => {
    return (
      <div css={[style.filter, style['filter--daterange']]}>
        {!window.getFlag('pm-date-range-picker-custom') && (
          <DateRangePicker
            data-testid="TreatmentFilters|DateRange"
            value={props.filter.date_range}
            placeholder={props.t('Date range')}
            onChange={(timeRange) =>
              props.onChangeFilter({
                ...props.filter,
                date_range: timeRange,
              })
            }
            turnaroundList={[]}
            allowFutureDate
            position="right"
            kitmanDesignSystem
            disabled={props.initialDataRequestStatus === 'PENDING'}
            isClearable
          />
        )}

        {window.getFlag('pm-date-range-picker-custom') && (
          <CustomDateRangePicker
            variant="menuFilters"
            value={
              props.filter.date_range
                ? convertDateRangeToTuple(props.filter.date_range)
                : undefined
            }
            onChange={(daterange) => {
              if (props.onChangeFilter) {
                props.onChangeFilter({
                  ...props.filter,
                  date_range: daterange,
                });
              }
            }}
          />
        )}
      </div>
    );
  };

  // TODO IMPLEMENT WHEN TREATMENT API IS READY TO ACCEPT THIS FILTER
  // const renderTreatmentFilter = (
  //   <div css={style.filter}>
  //     <Select
  //       placeholder={props.t('Treatment')}
  //       options={[]}
  //       onChange={() => {}}
  //       isMulti
  //       showAutoWidthDropdown
  //       appendToBody
  //       inlineShownSelection
  //       isDisabled={props.initialDataRequest === 'PENDING'}
  //     />
  //   </div>
  // );

  const squadFilter = (
    <div css={style.filter} data-testid="TreatmentFilters|Squads">
      <Select
        placeholder={props.t('Roster')}
        value={props.filter.squads}
        options={props.squads}
        onChange={(id) =>
          props.onChangeFilter({
            ...props.filter,
            squads: id,
          })
        }
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        isMulti
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  // TODO IMPLEMENT WHEN TREATMENT API IS READY TO ACCEPT THIS FILTER
  // const renderBodyAreaFilter = (
  //   <div css={style.filter}>
  //     <Select
  //       placeholder={props.t('Body area')}
  //       options={[]}
  //       onChange={() => {}}
  //       isMulti
  //       showAutoWidthDropdown
  //       appendToBody
  //       inlineShownSelection
  //       isDisabled={props.initialDataRequest === 'PENDING'}
  //     />
  //   </div>
  // );

  // TODO IMPLEMENT WHEN TREATMENT API IS READY TO ACCEPT THIS FILTER
  // const renderReasonFilter = (
  //   <div css={style.filter}>
  //     <Select
  //       placeholder={props.t('Reason')}
  //       options={[]}
  //       onChange={() => {}}
  //       isMulti
  //       showAutoWidthDropdown
  //       appendToBody
  //       inlineShownSelection
  //       isDisabled={props.initialDataRequest === 'PENDING'}
  //     />
  //   </div>
  // );

  // TODO IMPLEMENT WHEN TREATMENT API IS READY TO ACCEPT THIS FILTER
  // const renderPractionerFilter = (
  //   <div css={style.filter}>
  //     <Select
  //       placeholder={props.t('Practioner')}
  //       options={[]}
  //       onChange={() => {}}
  //       isMulti
  //       showAutoWidthDropdown
  //       appendToBody
  //       inlineShownSelection
  //       isDisabled={props.initialDataRequest === 'PENDING'}
  //     />
  //   </div>
  // );

  const renderAddTreatmentButton = () => {
    if (props.hiddenFilters?.includes(ADD_TREATMENT_BUTTON)) return null;
    return (
      permissions.medical.treatments.canCreate &&
      !props.isReviewMode && (
        <TextButton
          data-testid="TreatmentFilters|AddTreatment"
          text={props.t('Add treatment')}
          type="primary"
          kitmanDesignSystem
          onClick={props.onClickAddTreatment}
        />
      )
    );
  };

  return (
    <header css={style.header}>
      <div css={style.titleContainer}>
        <h3 css={style.title}>{props.t('Treatments')}</h3>
        <div css={style.actions}>
          {renderAddTreatmentButton()}
          {window.featureFlags['export-billing-buttons-team-level'] &&
            permissions.medical.issues.canExport &&
            !props.showDownloadTreatments &&
            !props.isReviewMode && (
              <TextButton
                data-testid="TreatmentFilters|ExportRosterBilling"
                text={props.t('Export billing')}
                type="secondary"
                isDisabled={props.isExporting}
                kitmanDesignSystem
                onClick={props.onClickExportRosterBilling}
              />
            )}
          {window.featureFlags['treatments-billing'] &&
            permissions.medical.issues.canExport &&
            props.showDownloadTreatments &&
            !props.isReviewMode && (
              <TextButton
                data-testid="TreatmentFilters|ExportBilling"
                text={props.t('Export billing')}
                type="secondary"
                kitmanDesignSystem
                onClick={props.onClickDownloadTreatment}
              />
            )}
          {props.isReviewMode &&
            window.featureFlags['replicate-treatments-clear-actions'] && (
              <TextButton
                data-testid="TreatmentFilters|ClearAllModalities"
                text={props.t('Clear modalities')}
                type="secondary"
                kitmanDesignSystem
                onClick={props.onClickRemoveAllModalities}
              />
            )}
          {props.isReviewMode && (
            <TextButton
              data-testid="TreatmentFilters|CancelReviewedTreatments"
              text={props.t('Cancel')}
              type="secondary"
              kitmanDesignSystem
              onClick={props.onClickCancelReviewing}
            />
          )}
          {permissions.medical.treatments.canCreate && props.isReviewMode && (
            <TextButton
              data-testid="TreatmentFilters|SaveReviewedTreatments"
              text={props.t('Save')}
              type="primary"
              kitmanDesignSystem
              onClick={props.onClickSaveReviewing}
            />
          )}
        </div>
      </div>

      {!props.isReviewMode && (
        <>
          <div css={style.filters}>
            {renderSearchFilter}
            {!props.hiddenFilters?.includes('squads') && squadFilter}
            {props.canSelectAthlete && renderPlayerFilter}
            {renderDateFilter()}
          </div>
          <div css={style.mobileFilters}>
            {renderDateFilter()}
            <TextButton
              text={props.t('Filters')}
              iconAfter="icon-filter"
              type="secondary"
              onClick={() => setIsFilterPanelShown(true)}
              kitmanDesignSystem
            />
            <SlidingPanelResponsive
              isOpen={isFilterPanelShown}
              title={props.t('Filters')}
              onClose={() => setIsFilterPanelShown(false)}
            >
              <div css={style.mobileFiltersPanel}>
                {renderSearchFilter}
                {!props.hiddenFilters?.includes('squads') && squadFilter}
                {props.canSelectAthlete && renderPlayerFilter}
              </div>
            </SlidingPanelResponsive>
          </div>
        </>
      )}
    </header>
  );
};

export const TreatmentFiltersTranslated: ComponentType<Props> =
  withNamespaces()(TreatmentFilters);
export default TreatmentFilters;
