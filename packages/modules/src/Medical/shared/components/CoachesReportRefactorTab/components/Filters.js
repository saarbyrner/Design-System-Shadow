// @flow

import debounce from 'lodash/debounce';
import _flatten from 'lodash/flatten';
import { useState, useEffect, useCallback } from 'react';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import { getIssueList } from '@kitman/common/src/utils/workload';
import {
  Box,
  Typography,
  Snackbar,
  IconButton,
} from '@kitman/playbook/components';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { TextButton, SlidingPanelResponsive } from '@kitman/components';
import { getPermittedSquads, getPositionGroups } from '@kitman/services';
import AutoCompleteFilter from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/components/AutoCompleteFilter';
import { SearchBarFilterMui } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/components/SearchBarFilter';
import style from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/styles';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { FiltersType, CoachesReportPayload } from '../types';
import Actions from './Actions';

type Props = {
  t: Translation,
  filters: FiltersType,
  updatePayload: (newPayload: CoachesReportPayload) => void,
  dataGridCurrentDate: string,
  rehydrateGrid: () => void,
  canCreateNotes: boolean,
  canExport: boolean,
  handleCopyLastReport: (athleteIds: Array<number>) => void,
  isCoachesNotesFetching: boolean,
  isCoachesNotesError: boolean,
  isBulkMedicalNotesSaveError: boolean,
};

const Filters = ({
  t,
  filters,
  updatePayload,
  dataGridCurrentDate,
  rehydrateGrid,
  canCreateNotes,
  canExport,
  handleCopyLastReport,
  isCoachesNotesFetching,
  isCoachesNotesError,
  isBulkMedicalNotesSaveError,
}: Props) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const issueOptions = defaultMapToOptions(getIssueList());
  const [positions, setPositions] = useState([]);
  const [squads, setSquads] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [positionGroupsData, squadsData] = await Promise.all([
        getPositionGroups(),
        getPermittedSquads(),
      ]);

      const formattedPositions = _flatten(
        positionGroupsData.map((positionGroup) => positionGroup.positions)
      ).map((position) => ({
        value: position.id,
        label: position.name,
      }));

      const formattedSquads = squadsData.map((squad) => ({
        value: squad.id,
        label: squad.name,
      }));

      setPositions((prevPositions) => {
        return JSON.stringify(prevPositions) !==
          JSON.stringify(formattedPositions)
          ? formattedPositions
          : prevPositions;
      });

      setSquads((prevSquads) => {
        return JSON.stringify(prevSquads) !== JSON.stringify(formattedSquads)
          ? formattedSquads
          : prevSquads;
      });
    } catch (err) {
      setError(t('The filters could not be loaded'));
    }
  });

  // Fetch squads and positions on mount
  useEffect(() => {
    fetchData();

    return () => {
      setPositions([]);
      setSquads([]);
      setError(null);
    };
  }, []);

  const debounceHandleSearch = debounce((value) => {
    updatePayload({
      filters: {
        ...filters,
        athlete_name: value,
      },
      next_id: null,
    });
  }, 400);

  const searchBar = (
    <div data-testid="coachesReportTab|SearchBar">
      <SearchBarFilterMui
        onValidation={(value) => {
          debounceHandleSearch(value);
        }}
        placeholder={t('Search athletes')}
      />
    </div>
  );

  const positionFilter = (isMobile) => (
    <AutoCompleteFilter
      testId="coachesReportTab|PositionSelect"
      label={t('Position')}
      options={positions || []}
      filterKey="positions"
      isMobile={isMobile || false}
      onFiltersUpdate={(newFilter) => {
        updatePayload({
          filters: {
            ...filters,
            ...newFilter,
          },
          next_id: null,
        });
      }}
      filters={filters}
    />
  );

  const squadFilter = (isMobile) => (
    <AutoCompleteFilter
      customStyles={{ width: '18rem' }}
      testId="coachesReportTab|SquadSelect"
      label={t('Squads')}
      options={squads || []}
      filterKey="squads"
      isMobile={isMobile || false}
      onFiltersUpdate={(newFilter) => {
        updatePayload({
          filters: {
            ...filters,
            ...newFilter,
          },
          next_id: null,
        });
      }}
      filters={filters}
    />
  );

  const issueFilter = (isMobile) => (
    <AutoCompleteFilter
      testId="coachesReportTab|IssueSelect"
      label={t('Injured')}
      options={issueOptions}
      filterKey="issues"
      isMobile={isMobile || false}
      onFiltersUpdate={(newFilter) => {
        updatePayload({
          filters: {
            ...filters,
            ...newFilter,
          },
          next_id: null,
        });
      }}
      filters={filters}
    />
  );

  const renderFilters = () => (
    <>
      {searchBar}
      {squadFilter()}
      {issueFilter()}
      {positionFilter()}
    </>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
        id="coachesReportV2Header"
      >
        <div
          css={[style.filters, style['filters--desktop']]}
          data-testid="CoachesReport|DesktopFilters"
        >
          {renderFilters()}
        </div>
        <Box
          sx={{
            justifyContent: 'flex-end',
            marginLeft: '1rem',
            width: '20%',
            '@media (max-width: 1200px)': {
              color: 'orange',
              width: '100%',
              marginLeft: '0',
              marginBottom: '1rem',
            },
          }}
        >
          <Actions
            t={t}
            canExport={canExport}
            filters={filters}
            dataGridCurrentDate={dataGridCurrentDate}
            rehydrateGrid={rehydrateGrid}
            canCreateNotes={canCreateNotes}
            handleCopyLastReport={handleCopyLastReport}
            isCoachesNotesFetching={isCoachesNotesFetching}
            isCoachesNotesError={isCoachesNotesError}
          />
          {isBulkMedicalNotesSaveError && (
            <Typography variant="h6" sx={style.bulkNotesErrorMessage}>
              {t('Bulk note save error')}
            </Typography>
          )}
        </Box>
      </Box>
      {/* Mobile filters */}
      <Box
        sx={{ ...style.filters, ...style['filters--mobile'] }}
        data-testid="TeamFilters|MobileFilters"
      >
        <TextButton
          text={t('Filters')}
          iconAfter="icon-filter"
          type="secondary"
          onClick={() => setShowFilterPanel(true)}
          kitmanDesignSystem
        />
        <SlidingPanelResponsive
          isOpen={showFilterPanel}
          title={t('Filters')}
          onClose={() => setShowFilterPanel(false)}
        >
          <Box sx={style.filtersPanel}>{renderFilters()}</Box>
        </SlidingPanelResponsive>
      </Box>
      <Snackbar
        sx={{ marginBottom: '2rem' }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={!!error}
        message={error}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setError(null)}
          >
            <KitmanIcon fontSize="small" name={KITMAN_ICON_NAMES.Close} />
          </IconButton>
        }
      />
    </>
  );
};

export default Filters;
