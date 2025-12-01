// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  determineMedicalLevelAndTab,
  getNoteActionElement,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { SelectOption as Option } from '@kitman/components/src/types';
import { breakPoints, colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import { convertDateRangeToTuple } from '@kitman/playbook/components/wrappers/CustomDateRangePicker/utils';
import { DateRangePickerWrapper } from '@kitman/playbook/components/wrappers/DateRangePickerWrapper';
import type {
  NotesFilters as NotesFiltersType,
  RequestStatus,
} from '../../types';

const defaultOrganisationAnnotationTypes = [
  'OrganisationAnnotationTypes::Medical',
  'OrganisationAnnotationTypes::Nutrition',
  'OrganisationAnnotationTypes::Diagnostic',
  'OrganisationAnnotationTypes::Document',
  'OrganisationAnnotationTypes::Procedure',
  'OrganisationAnnotationTypes::LegacyPresagiaConcussion',
];

const style = {
  header: {
    alignItems: 'flex-start',
    background: colors.p06,
    border: `1px solid ${colors.neutral_300}`,
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    marginBottom: 8,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  title: {
    color: colors.grey_300,
    fontSize: 20,
    fontWeight: 600,
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  'filters--desktop': {
    gap: 5,
    [`@media (max-width: ${breakPoints.desktop})`]: {
      display: 'none',
    },
  },
  'filters--mobile': {
    gap: 5,
    [`@media (min-width: ${breakPoints.desktop})`]: {
      display: 'none',
    },
    [`@media (max-width: ${breakPoints.tablet})`]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
  filter: {
    [`@media (min-width: ${breakPoints.desktop})`]: {
      minWidth: 180,
    },
    [`@media (max-width: ${breakPoints.desktop})`]: {
      display: 'block',
      marginBottom: 10,
      width: '100%',
    },
  },
  'filter--daterange': {
    [`@media (max-width: ${breakPoints.tablet})`]: {
      marginBottom: 5,
    },
    [`@media (max-width: ${breakPoints.desktop})`]: {
      marginTop: 0,
      width: 235,
    },
  },
  filtersPanel: {
    paddingLeft: 25,
    paddingRight: 25,
    margin: '8px 0 0 0',
  },
  notesButtons: {
    display: 'flex',
    gap: 5,
  },
};

type Props = {
  onNotesFiltersChange: Function,
  notesFilters: NotesFiltersType,
  squads: Array<Option>,
  annotationTypes: Array<Option>,
  authors: Array<Option>,
  initialDataRequestStatus: RequestStatus,
  onClickAddMedicalNote: Function,
  hiddenFilters?: Array<string>,
  isAthleteOnTrial?: boolean,
};

const NotesFilters = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showArchivedNotes, setShowArchivedNotes] = useState<boolean>(false);
  const { trackEvent } = useEventTracking();

  const changeFilterType = (ids: number[]) => {
    const annotationTypes = [
      ...defaultOrganisationAnnotationTypes,
      ...(window.featureFlags?.['rehab-note']
        ? ['OrganisationAnnotationTypes::RehabSession']
        : []),
      ...(window.featureFlags?.['display-telephone-note']
        ? ['OrganisationAnnotationTypes::Telephone']
        : []),
      ...(window.featureFlags?.['command-health-integration']
        ? ['OrganisationAnnotationTypes::MedicalDictation']
        : []),
      ...(window.featureFlags?.['coaches-report-refactor']
        ? ['OrganisationAnnotationTypes::DailyStatusNote']
        : []),
    ];

    props.onNotesFiltersChange({
      ...props.notesFilters,
      organisation_annotation_type: annotationTypes,
      organisation_annotation_type_ids: ids,
    });
  };

  // Fixed: Ensure search bar has proper data-testid and event handling
  const searchBar = (
    <div css={style.filter}>
      <InputTextField
        data-testid="rosterOverviewTab|SearchBar"
        kitmanDesignSystem
        onChange={(e) => {
          // Fixed: Ensure the event handler is properly called
          if (props.onNotesFiltersChange) {
            props.onNotesFiltersChange({
              ...props.notesFilters,
              content: e.target.value,
            });
          }
        }}
        placeholder={props.t('Search')}
        searchIcon
        value={props.notesFilters?.content || ''}
      />
    </div>
  );

  // Fixed: Add proper conditional rendering for squad filter
  const squadFilter = !props.hiddenFilters?.includes('squads') ? (
    <div css={style.filter} data-testid="DiagnosticFilters|SquadFilter">
      <Select
        options={props.squads || []}
        onChange={(id) => {
          if (props.onNotesFiltersChange) {
            props.onNotesFiltersChange({
              ...props.notesFilters,
              squads: id,
            });
          }
        }}
        value={props.notesFilters?.squads || []}
        placeholder={props.t('Roster')}
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        isMulti
        appendToBody
        inlineShownSelection
      />
    </div>
  ) : null;

  const authorFilter = (
    <div css={style.filter}>
      <Select
        options={props.authors || []}
        onChange={(id) => {
          if (props.onNotesFiltersChange) {
            props.onNotesFiltersChange({
              ...props.notesFilters,
              author: id,
            });
          }
        }}
        value={props.notesFilters?.author || []}
        placeholder={props.t('Author')}
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        isMulti
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  const noteTypeFilter = (
    <div css={style.filter}>
      <Select
        options={props.annotationTypes || []}
        onChange={changeFilterType}
        value={props.notesFilters?.organisation_annotation_type_ids || []}
        isMulti
        inlineShownSelection
        placeholder={props.t('Note type')}
        appendToBody
      />
    </div>
  );

  const dateFilter = (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div css={[style.filter, style['filter--daterange']]}>
        {!window.getFlag('pm-date-range-picker-custom') && (
          <DateRangePickerWrapper
            value={props.notesFilters?.date_range}
            onChange={(daterange) => {
              if (props.onNotesFiltersChange) {
                props.onNotesFiltersChange({
                  ...props.notesFilters,
                  date_range: daterange,
                });
              }
            }}
          />
        )}

        {window.getFlag('pm-date-range-picker-custom') && (
          <CustomDateRangePicker
            variant="menuFilters"
            value={
              props.notesFilters?.date_range
                ? convertDateRangeToTuple(props.notesFilters.date_range)
                : undefined
            }
            onChange={(daterange) => {
              if (props.onNotesFiltersChange) {
                props.onNotesFiltersChange({
                  ...props.notesFilters,
                  date_range: daterange,
                });
              }
            }}
          />
        )}
      </div>
    </LocalizationProvider>
  );

  // Proper conditional rendering for add note button
  const renderAddNoteButton = () => {
    // Check if button should be hidden
    if (props.hiddenFilters?.includes('add_medical_note_button')) {
      return null;
    }

    // Check permissions and archived state
    if (permissions?.medical?.notes?.canCreate && !showArchivedNotes) {
      return (
        <TextButton
          text={props.t('Add note')}
          type="primary"
          kitmanDesignSystem
          onClick={() => {
            if (trackEvent) {
              trackEvent(performanceMedicineEventNames.clickAddMedicalNote, {
                ...determineMedicalLevelAndTab(),
                ...getNoteActionElement('Add note button'),
              });
            }
            if (props.onClickAddMedicalNote) {
              props.onClickAddMedicalNote();
            }
          }}
        />
      );
    }

    return null;
  };

  // Fixed: Proper conditional rendering for archive button
  const renderArchiveButton = () => {
    // Don't show archive button for trial athletes
    if (props.isAthleteOnTrial) {
      return null;
    }

    if (permissions?.medical?.notes?.canArchive) {
      if (!showArchivedNotes) {
        return (
          <TextButton
            text={props.t('View archive')}
            type="secondary"
            onClick={() => {
              setShowArchivedNotes(true);
              if (props.onNotesFiltersChange) {
                props.onNotesFiltersChange({
                  ...props.notesFilters,
                  archived: true,
                });
              }
            }}
            kitmanDesignSystem
          />
        );
      }
      return (
        <TextButton
          text={props.t('Exit archive')}
          type="primary"
          onClick={() => {
            setShowArchivedNotes(false);
            if (props.onNotesFiltersChange) {
              props.onNotesFiltersChange({
                ...props.notesFilters,
                archived: false,
              });
            }
          }}
          kitmanDesignSystem
        />
      );
    }

    return null;
  };

  return (
    <header css={style.header}>
      <div css={style.titleContainer}>
        <h3 css={style.title} data-testid="NotesFilters|Title">
          {showArchivedNotes && !props.isAthleteOnTrial
            ? props.t('Archived notes')
            : props.t('Notes')}
        </h3>
        <div css={style.notesButtons}>
          {renderAddNoteButton()}
          {renderArchiveButton()}
        </div>
      </div>

      {/* Desktop Filters */}
      <div
        css={[style.filters, style['filters--desktop']]}
        data-testid="NotesFilters|DesktopFilters"
      >
        {searchBar}
        {squadFilter}
        {authorFilter}
        {noteTypeFilter}
        {dateFilter}
      </div>

      {/* Mobile Filters */}
      <div
        css={[style.filters, style['filters--mobile']]}
        data-testid="NotesFilters|MobileFilters"
      >
        {dateFilter}

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
            {searchBar}
            {squadFilter}
            {authorFilter}
            {noteTypeFilter}
          </div>
        </SlidingPanelResponsive>
      </div>
    </header>
  );
};

export const NotesFiltersTranslated = withNamespaces()(NotesFilters);
export default NotesFilters;
