// @flow
import { withNamespaces } from 'react-i18next';
import {
  DateRangePicker,
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import type { SelectOption as Option } from '@kitman/components/src/types';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useState } from 'react';
import type { EntityAttachmentFilters } from '@kitman/modules/src/Medical/shared/types/medical';
import { fileGroupToIcon } from '@kitman/common/src/utils/mediaHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import type {
  FilesFilters as DocumentsFiltersType,
  RequestStatus,
} from '../../types';

import { style } from '../MedicalDocumentsTab/DocumentsFilters';
import type { ExportAttachment } from '../../types/medical/MedicalFile';
import {
  ADD_MEDICAL_FILE_BUTTON,
  SCAN_BUTTON,
} from '../../constants/elementTags';

type Props = {
  setIsPanelOpen: Function,
  playerOptions: Array<Option>,
  categoryOptions: Array<Option>,
  filesSourceOptions: Array<Option>,
  fileTypeOptions: Array<Option>,
  initialDataRequestStatus: RequestStatus,
  showPlayerFilter: boolean,
  filters: ?DocumentsFiltersType,
  enhancedFilters: ?EntityAttachmentFilters,
  setFilters: Function, // NOTE: callback prop is common but behaviour differs for enhanced filters
  showArchivedDocuments: boolean,
  setShowArchivedDocuments: Function,
  onExportClick: Function,
  exportAttachments: Array<ExportAttachment>,
  hiddenFilters: Array<string>,
  isAthleteOnTrial?: boolean,
  onScanClick: () => void,
  atIssueLevel: boolean,
};

const FilesFilters = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const { permissions } = usePermissions();

  const [showMobileFilterPanel, setShowMobileFilterPanel] =
    useState<boolean>(false);

  const enhancedFilesFlow =
    window.featureFlags['medical-files-tab-enhancement'];

  const renderSearchBar = (
    <div css={style.filter} data-testid="FilesFilters|SearchBar">
      <InputTextField
        kitmanDesignSystem
        onChange={(e) => {
          props.setFilters(
            enhancedFilesFlow
              ? {
                  filename: e.target.value,
                }
              : {
                  ...props.filters,
                  filename: e.target.value,
                }
          );
        }}
        placeholder={props.t('Search')}
        searchIcon
        value={
          (enhancedFilesFlow
            ? props.enhancedFilters?.filename
            : props.filters?.filename) || ''
        }
      />
    </div>
  );

  const renderDateFilter = (
    <div
      css={[style.filter, style['filter--daterange']]}
      data-testid="FilesFilters|DateRange"
    >
      {!window.getFlag('pm-date-range-picker-custom') && (
        <DateRangePicker
          value={
            (enhancedFilesFlow
              ? props.enhancedFilters?.entity_date
              : props.filters?.document_date) || null
          }
          placeholder={props.t('Date range')}
          onChange={(dateRange) => {
            props.setFilters(
              enhancedFilesFlow
                ? {
                    entity_date: dateRange,
                  }
                : {
                    ...props.filters,
                    document_date: dateRange,
                  }
            );
          }}
          turnaroundList={[]}
          position="right"
          isClearable
          onClear={() => {
            props.setFilters(
              enhancedFilesFlow
                ? { entity_date: null }
                : {
                    ...props.filters,
                    document_date: null,
                  }
            );
          }}
          kitmanDesignSystem
        />
      )}

      {window.getFlag('pm-date-range-picker-custom') && (
        <CustomDateRangePicker
          variant="menuFilters"
          onChange={(daterange) => {
            if (props.setFilters) {
              props.setFilters(
                enhancedFilesFlow
                  ? {
                      entity_date: daterange,
                    }
                  : {
                      ...props.filters,
                      document_date: daterange,
                    }
              );
            }
          }}
        />
      )}
    </div>
  );

  const renderPlayerFilter = (
    <div css={style.filter} data-testid="FilesFilters|PlayerSelect">
      <Select
        placeholder={props.t('Player')}
        value={
          enhancedFilesFlow
            ? props.enhancedFilters?.entity_athlete_id
            : props.filters?.athlete_id
        }
        options={props.playerOptions}
        onChange={(id) => {
          props.setFilters(
            enhancedFilesFlow
              ? {
                  entity_athlete_id: id,
                }
              : {
                  ...props.filters,
                  athlete_id: id,
                }
          );
        }}
        isClearable
        onClear={() => {
          props.setFilters(
            enhancedFilesFlow
              ? {
                  entity_athlete_id: null,
                }
              : {
                  ...props.filters,
                  athlete_id: null,
                }
          );
        }}
        showAutoWidthDropdown
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
      />
    </div>
  );

  const renderCategoryFilter = (
    <div css={style.filter} data-testid="FilesFilters|CategorySelect">
      <Select
        placeholder={props.t('Categories')}
        value={
          enhancedFilesFlow
            ? props.enhancedFilters?.medical_attachment_category_ids
            : props.filters?.document_category_ids
        }
        options={props.categoryOptions}
        onChange={(ids) => {
          props.setFilters(
            enhancedFilesFlow
              ? {
                  medical_attachment_category_ids: ids,
                }
              : {
                  ...props.filters,
                  document_category_ids: ids,
                }
          );
        }}
        isClearable
        onClear={() => {
          props.setFilters(
            enhancedFilesFlow
              ? {
                  medical_attachment_category_ids: [],
                }
              : {
                  ...props.filters,
                  document_category_ids: [],
                }
          );
        }}
        showAutoWidthDropdown
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        isMulti
      />
    </div>
  );

  const renderSourceFilter = (
    <div css={style.filter} data-testid="FilesFilters|SourceSelect">
      <Select
        placeholder={props.t('Source')}
        value={props.enhancedFilters?.entity_types}
        options={props.filesSourceOptions}
        onChange={(ids) => {
          props.setFilters({
            entity_types: ids,
          });
        }}
        isClearable
        onClear={() => {
          props.setFilters({
            entity_types: null,
          });
        }}
        showAutoWidthDropdown
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        isMulti
      />
    </div>
  );

  const customOptionStyle = (option: Option): Object => {
    // $FlowIgnore[incompatible-call] Option value will be a string matching EntityAttachmentFileGroup
    const iconWithColor = fileGroupToIcon(option.value);

    // TODO: use kitmanReactSelect__optionLabel once is multi select
    return {
      'margin-right': '100px',
      '::before': {
        content: iconWithColor.icon,
        color: iconWithColor.color,
        fontFamily: 'kitman',
        display: 'inline',
        marginRight: '8px',
      },
    };
  };

  const renderFileTypeFilter = (
    <div css={style.filter} data-testid="FilesFilters|FileTypeSelect">
      <Select
        placeholder={props.t('File type')}
        value={props.enhancedFilters?.file_types}
        options={props.fileTypeOptions}
        onChange={(values) => {
          props.setFilters({
            file_types: values,
          });
        }}
        isClearable
        onClear={() => {
          props.setFilters({
            file_types: [],
          });
        }}
        customSelectStyles={{
          menu: (base) => {
            return { ...base, ...{ minWidth: '100%' } };
          },
          option: (base, { data }) => {
            return { ...base, ...customOptionStyle(data) };
          },
        }}
        showAutoWidthDropdown={false}
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        isMulti
      />
    </div>
  );

  const renderAddDocumentButton = () => {
    if (props.hiddenFilters?.includes(ADD_MEDICAL_FILE_BUTTON)) return null;
    return (
      !props.showArchivedDocuments && (
        <TextButton
          text={props.t('Add document')}
          type="primary"
          kitmanDesignSystem
          onClick={() => props.setIsPanelOpen(true)}
          isDisabled={!permissions.medical.documents.canCreate}
          data-testid="FilesFilters|AddDocument"
        />
      )
    );
  };

  const renderScanButton = () => {
    if (
      props.atIssueLevel ||
      !window.featureFlags['medical-mass-scanning'] ||
      props.hiddenFilters?.includes(SCAN_BUTTON)
    ) {
      return null;
    }
    return (
      <TextButton
        text={props.t('Scan')}
        type="secondary"
        kitmanDesignSystem
        onClick={props.onScanClick}
        isDisabled={!permissions.medical.documents.canCreate}
        data-testid="DocumentsFilters|Scan"
      />
    );
  };

  return (
    <header css={style.header}>
      <div css={style.titleContainer}>
        <h3 css={style.title} data-testid="FilesFilters|Title">
          {props.showArchivedDocuments && !props.isAthleteOnTrial
            ? props.t('Archived Documents')
            : props.t('Documents')}
        </h3>
        <div css={style.documentButtons}>
          {renderAddDocumentButton()}
          {renderScanButton()}
          {!props.showArchivedDocuments &&
            window.featureFlags['export-multi-doc'] &&
            permissions.medical.issues.canExport && (
              <TextButton
                text={props.t('Export')}
                type="secondary"
                kitmanDesignSystem
                onClick={props.onExportClick}
                isDisabled={props.exportAttachments?.length < 1}
                data-testid="FilesFilters|ExportDocuments"
              />
            )}
          {window.featureFlags['medical-documents-files-area'] &&
            !props.isAthleteOnTrial &&
            (!props.showArchivedDocuments ? (
              <TextButton
                text={props.t('View Archive')}
                type="secondary"
                onClick={() => {
                  props.setShowArchivedDocuments(true);
                  props.setFilters({
                    ...props.filters,
                    archived: true,
                  });
                  trackEvent(
                    performanceMedicineEventNames.viewArchivedMedicalDocuments,
                    {
                      ...determineMedicalLevelAndTab(),
                    }
                  );
                }}
                kitmanDesignSystem
              />
            ) : (
              <TextButton
                text={props.t('Exit')}
                type="primary"
                onClick={() => {
                  props.setShowArchivedDocuments(false);
                  props.setFilters({
                    ...props.filters,
                    archived: false,
                  });
                }}
                kitmanDesignSystem
              />
            ))}
        </div>
      </div>
      <div
        css={[style.filters, style['filters--desktop']]}
        data-testid="FilesFilters|DesktopFilters"
      >
        {renderSearchBar}
        {renderDateFilter}
        {props.showPlayerFilter && renderPlayerFilter}
        {enhancedFilesFlow && renderFileTypeFilter}
        {renderCategoryFilter}
        {enhancedFilesFlow && renderSourceFilter}
      </div>
      <div
        css={[style.filters, style['filters--mobile']]}
        data-testid="FilesFilters|MobileFilters"
      >
        {renderDateFilter}

        <TextButton
          text={props.t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setShowMobileFilterPanel(true)}
          kitmanDesignSystem
        />

        <SlidingPanelResponsive
          isOpen={showMobileFilterPanel}
          title={props.t('Filters')}
          onClose={() => setShowMobileFilterPanel(false)}
        >
          <div css={style.filtersPanel}>
            {renderSearchBar}
            {props.showPlayerFilter && renderPlayerFilter}
            {enhancedFilesFlow && renderFileTypeFilter}
            {renderCategoryFilter}
            {enhancedFilesFlow && renderSourceFilter}
          </div>
        </SlidingPanelResponsive>
      </div>
    </header>
  );
};

export const FilesFiltersTranslated = withNamespaces()(FilesFilters);
export default FilesFilters;
