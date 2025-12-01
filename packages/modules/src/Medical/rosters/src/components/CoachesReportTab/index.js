/* eslint-disable import/no-named-as-default */
// @flow
import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { withNamespaces } from 'react-i18next';
import { getPermittedSquads, getPositionGroups } from '@kitman/services';
import {
  AppStatus,
  DelayedLoadingFeedback,
  Select,
  TextButton,
  SlidingPanelResponsive,
} from '@kitman/components';
import { rootTheme } from '@kitman/playbook/themes';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import { getIssueList } from '@kitman/common/src/utils/workload';
import debounce from 'lodash/debounce';
import _flatten from 'lodash/flatten';
import {
  Box,
  Typography,
  Button,
  Popover,
  DateCalendar,
  Tooltip,
} from '@kitman/playbook/components/index';

import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import type { Translation } from '@kitman/common/src/types/i18n';
import AutoCompleteFilter from './components/AutoCompleteFilter';
import { CommentsOverviewGridTranslated as CoachesReportOverviewGrid } from './components/CoachesReportOverviewGrid';
import { ActionsTranslated as Actions } from './components/Actions';
import type { RequestStatus } from '../../../../shared/types';
import style from './styles';
import type { GridData } from './types';
import SearchBarFilter, {
  SearchBarFilterMui,
} from '../RosterOverviewTab/components/SearchBarFilter';

export type CoachesFilters = {
  athlete_name: string,
  positions: Array<number>,
  squads: Array<number>,
  availabilities: Array<number>,
  issues: Array<number>,
};

type Props = {
  grid: GridData,
  fetchGrid: Function,
  requestStatus: RequestStatus,
  onSetRequestStatus: (string) => void,
  filters: CoachesFilters,
  permissions: {
    medical: {
      notes: { canCreate: boolean },
      issues: { canExport: boolean, canView: boolean },
      availability: { canView: boolean },
    },
  },
  t: Translation,
  addEditComment: Function,
  onFiltersUpdate: Function,
};

/**
 *
 * TODO:
 * 1) extract functions into utils,
 * 2) consts into CONSTS & types into TYPES,
 * 3) RTK all queries & mutations,
 * 4) extract v2 int seperate flow
 * 5) use RTK slice for state management (get rid of so many useState - polluting file at this point, herd to track)
 * 6) extract RTE component so that noteContent state isn't fragile
 * 7) extract all other components for readability
 *
 * investigate:
 * if we're using RTK for fetching and handling our data,
 * do we need so many useEffects?
 */

const CoachesReportTab = (props: Props) => {
  const [coachesReportGridLoaded, setCoachesReportGridLoaded] =
    useState<boolean>(false);
  const [squads, setSquads] = useState();
  const [positions, setPositions] = useState([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState<Array<number>>([]);
  const coachesReportV2Enabled = window.featureFlags?.['coaches-report-v2'];
  const [modalOpen, setModalOpen] = useState(false);
  const [isInMultiCopyNoteMode, setIsInMultiCopyNoteMode] = useState(false);
  const [dateSelectedOnCalendar, setDateSelectedOnCalendar] =
    useState<moment.Moment>(moment());
  const [dataGridCurrentDate, setDataGridCurrentDate] = useState(
    dateSelectedOnCalendar
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const tabHeader = coachesReportV2Enabled
    ? props.t('Coaches Report - {{date}}', {
        date: formatStandard({ date: dataGridCurrentDate }),
      })
    : props.t('Coaches Report');

  // Retrieving data
  const getNextAthletes = (reset = false) => {
    const nextId = reset ? null : props.grid.next_id;
    props.fetchGrid(reset, nextId, dataGridCurrentDate?.toString());
  };
  const resetGrid = () => getNextAthletes(true);
  const debounceResetGrid = useDebouncedCallback(() => resetGrid(), 400);
  const canCreateNotes = props.permissions?.medical?.notes?.canCreate;

  // Cleanup debounce on demount
  useEffect(() => {
    return () => {
      debounceResetGrid?.cancel?.();
    };
  }, [debounceResetGrid, props.grid]);

  // Check if data loaded
  useEffect(() => {
    setCoachesReportGridLoaded(props.requestStatus === 'SUCCESS');
    setIsInitialDataLoaded(!!props.grid);
  }, [props.requestStatus]);

  // Reset grid when filters change
  useEffect(() => {
    if (!isInitialDataLoaded) {
      return;
    }
    debounceResetGrid();
  }, [props.filters]);

  // Filtering by search
  const handleSearch = (value) =>
    props.onFiltersUpdate({
      ...props.filters,
      athlete_name: value,
    });
  const debounceHandleSearch = debounce(handleSearch, 400);

  // Filtering by issue
  const issueOptions = defaultMapToOptions(getIssueList());

  // Filtering by squad and positions
  useEffect(() => {
    Promise.all([getPositionGroups(), getPermittedSquads()]).then(
      ([positionGroupsData, squadsData]) => {
        setPositions(
          _flatten(
            positionGroupsData.map((positionGroup) => positionGroup.positions)
          ).map((position) => ({
            value: position.id,
            label: position.name,
          }))
        );
        setSquads(
          squadsData.map((squad) => ({
            value: squad.id,
            label: squad.name,
          }))
        );
      }
    );
  }, []);

  const getNoteCreationHeaderStyles = (variant) => {
    switch (variant) {
      case 'container':
        return {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: rootTheme.palette.secondary.main,
          width: '100%',
          height: '5rem',
          padding: '1rem',
        };
      case 'text':
        return {
          fontWeight: '600',
          color: rootTheme.palette.primary.main,
        };
      case 'buttonWrapper':
        return {
          display: 'flex',
          gap: '0.625rem',
        };
      default:
        return {};
    }
  };

  // Components
  const searchBar = (
    <div css={style.filter} data-testid="coachesReportTab|SearchBar">
      <SearchBarFilter
        onValidation={(value) => {
          debounceHandleSearch(value);
        }}
        placeholder={props.t('Search athletes')}
      />
    </div>
  );

  const searchBarMui = (
    <div data-testid="coachesReportTab|SearchBarMui">
      <SearchBarFilterMui
        onValidation={(value) => {
          debounceHandleSearch(value);
        }}
        placeholder={props.t('Search athletes')}
      />
    </div>
  );

  const squadFilter = (
    <div css={style.filter} data-testid="coachesReportTab|SquadSelect">
      <Select
        appendToBody
        options={squads || []}
        onChange={(selectedItems) =>
          props.onFiltersUpdate({
            ...props.filters,
            squads: selectedItems,
          })
        }
        value={props.filters?.squads}
        placeholder={props.t('Squad')}
        isMulti
        inlineShownSelection
      />
    </div>
  );

  const issueFilter = (
    <div css={style.filter} data-testid="coachesReportTab|IssueSelect">
      <Select
        appendToBody
        options={issueOptions}
        onChange={(selectedItems) =>
          props.onFiltersUpdate({
            ...props.filters,
            issues: selectedItems,
          })
        }
        value={props.filters?.issues}
        placeholder={props.t('Injured')}
        isMulti
        showAutoWidthDropdown
        inlineShownSelection
      />
    </div>
  );

  const positionFilter = (
    <div css={style.filter} data-testid="coachesReportTab|PositionSelect">
      <Select
        appendToBody
        options={positions}
        onChange={(selectedItems) =>
          props.onFiltersUpdate({
            ...props.filters,
            positions: selectedItems,
          })
        }
        value={props.filters.positions}
        placeholder={props.t('Position')}
        isMulti
        inlineShownSelection
      />
    </div>
  );

  const positionFilterMui = (isMobile) => (
    <AutoCompleteFilter
      testId="coachesReportTab|PositionSelectMui"
      label={props.t('Position')}
      options={positions || []}
      filterKey="positions"
      isMobile={isMobile || false}
      onFiltersUpdate={props.onFiltersUpdate}
      filters={props.filters}
    />
  );

  const squadFilterMui = (isMobile) => (
    <AutoCompleteFilter
      testId="coachesReportTab|SquadSelectMui"
      label={props.t('Squads')}
      options={squads || []}
      filterKey="squads"
      isMobile={isMobile || false}
      onFiltersUpdate={props.onFiltersUpdate}
      filters={props.filters}
    />
  );

  const issueFilterMui = (isMobile) => {
    return (
      <AutoCompleteFilter
        testId="coachesReportTab|IssueSelectMui"
        label={props.t('Injured')}
        options={issueOptions}
        filterKey="issues"
        isMobile={isMobile || false}
        onFiltersUpdate={props.onFiltersUpdate}
        filters={props.filters}
      />
    );
  };

  const coachesReportV1Header = () => {
    return (
      <Actions
        t={props.t}
        canExport={
          props.permissions?.medical?.issues?.canExport &&
          window.featureFlags['nfl-coaches-report']
        }
        filters={props.filters}
      />
    );
  };

  const renderMuiFilters = () => (
    <>
      {searchBarMui}
      {squadFilterMui()}
      {issueFilterMui()}
      {positionFilterMui()}
    </>
  );

  const renderKitmanFilters = () => (
    <>
      {searchBar}
      {squadFilter}
      {issueFilter}
      {positionFilter}
    </>
  );

  const coachesReportV2Header = () => {
    return (
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
          data-testid="CoachesReport|DesktopFiltersMui"
        >
          {renderMuiFilters()}
        </div>
        <Box
          sx={{
            justifyContent: 'flex-end',
            marginLeft: '1rem',
          }}
        >
          <Actions
            canExport={props.permissions?.medical?.issues?.canExport}
            filters={props.filters}
            coachesReportV2Enabled={coachesReportV2Enabled}
            dataGridCurrentDate={dataGridCurrentDate}
            rehydrateGrid={debounceResetGrid}
            canCreateNotes={canCreateNotes}
          />
        </Box>
      </Box>
    );
  };

  const handleCalendarOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const dateCycle = (direction: 'left' | 'right'): void => {
    const currentDate = moment(dataGridCurrentDate);
    const newDate =
      direction === 'left'
        ? currentDate.subtract(1, 'days')
        : currentDate.add(1, 'days');

    setDataGridCurrentDate(moment(newDate));
    setDateSelectedOnCalendar(moment(newDate));
    debounceResetGrid();
  };

  // Sets the value to state as the user clicks through the calendar
  const onCalendarDateChange = (dateFromCalendar: ?Date): void => {
    // ensure new date selected before making a redundant refetch
    if (!dateSelectedOnCalendar.isSame(dateFromCalendar)) {
      setDateSelectedOnCalendar(moment(dateFromCalendar));
      setDataGridCurrentDate(moment(dateFromCalendar));
      debounceResetGrid();
    }
  };

  // Called when the user closes the calendar view. Closes calendar UI and sets state for fetch
  const onCalendarClose = () => {
    setAnchorEl(null);
  };

  const renderCalendarPopOver = () => {
    const open = Boolean(anchorEl);
    const id = open ? 'calendar-popover' : undefined;

    return (
      <Box>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={onCalendarClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateCalendar
              onChange={onCalendarDateChange}
              value={dateSelectedOnCalendar}
            />
          </LocalizationProvider>
        </Popover>
      </Box>
    );
  };

  const renderDateCycleAndCalendar = () => {
    return (
      <Box sx={{ display: 'flex' }}>
        <Typography>{formatStandard({ date: dataGridCurrentDate })}</Typography>
        <Box sx={{ display: 'flex' }}>
          <Tooltip title={props.t('Previous day')}>
            <Button
              sx={{
                margin: '0 1rem 0 1.5rem',
                padding: '0 0 5px 0',
                minWidth: 'fit-content',
              }}
              variant="text"
              onClick={() => dateCycle('left')}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.KeyboardArrowLeft} />
            </Button>
          </Tooltip>
          <Tooltip title={props.t('Next day')}>
            <Button
              sx={{
                margin: '0 1rem 0 1rem',
                padding: '0 0 5px 0',
                minWidth: 'fit-content',
              }}
              variant="text"
              onClick={() => dateCycle('right')}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.KeyboardArrowRight} />
            </Button>
          </Tooltip>
          <Tooltip title={props.t('Open Calendar')}>
            <Button
              sx={{
                margin: '0 0 0 1rem',
                padding: '0 0 5px 0',
                minWidth: 'fit-content',
              }}
              variant="secondary"
              onClick={handleCalendarOpen}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.CalendarToday} />
            </Button>
          </Tooltip>
          {renderCalendarPopOver()}
        </Box>
      </Box>
    );
  };

  const renderNoteCreationHeader = () => {
    return (
      <Box
        sx={getNoteCreationHeaderStyles('container')}
        id="noteCreationHeader"
      >
        <Typography sx={getNoteCreationHeaderStyles('text')}>
          {props.t('{{count}} selected', {
            count: rowSelectionModel.length,
          })}
        </Typography>
        {canCreateNotes && (
          <Box sx={getNoteCreationHeaderStyles('buttonWrapper')}>
            <Button onClick={() => setModalOpen(true)} variant="text">
              {props.t('Add notes')}
              <Box sx={{ marginLeft: '0.5rem' }}>
                <KitmanIcon name={KITMAN_ICON_NAMES.Note} />
              </Box>
            </Button>
            <Button
              onClick={() => setIsInMultiCopyNoteMode((prev) => !prev)}
              variant="text"
            >
              {props.t('Copy last note')}
              <Box sx={{ marginLeft: '0.5rem' }}>
                <KitmanIcon name={KITMAN_ICON_NAMES.FileCopy} />
              </Box>
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  const coachesReportTab = () => {
    return (
      <div
        className="CoachesReportTab"
        css={style.tabWrapper}
        data-testid="CoachesReportTab"
      >
        <header
          css={[
            style.header,
            !coachesReportGridLoaded && style.disabledElement,
          ]}
        >
          {!coachesReportV2Enabled && (
            <div
              css={[style.filters, style['filters--desktop']]}
              data-testid="CoachesReport|DesktopFiltersKitman"
            >
              {renderKitmanFilters()}
            </div>
          )}
          <div css={style.titleContainer}>
            <h3 css={style.title}>{tabHeader}</h3>
            {!coachesReportV2Enabled
              ? coachesReportV1Header()
              : renderDateCycleAndCalendar()}
          </div>
          {coachesReportV2Enabled &&
            (!rowSelectionModel.length
              ? coachesReportV2Header()
              : renderNoteCreationHeader())}
          <div
            css={[style.filters, style['filters--mobile']]}
            data-testid="TeamFilters|MobileFilters"
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
                {coachesReportV2Enabled
                  ? renderMuiFilters()
                  : renderKitmanFilters()}
              </div>
            </SlidingPanelResponsive>
          </div>
        </header>
        {isInitialDataLoaded && (
          <CoachesReportOverviewGrid
            dataGridCurrentDate={dataGridCurrentDate.toString()}
            fetchMoreData={getNextAthletes}
            addEditComment={props.addEditComment}
            t={props.t}
            coachesReportGridLoaded={() => {
              setCoachesReportGridLoaded(true);
            }}
            canViewInjuries={props.permissions?.medical?.issues?.canView}
            canCreateNotes={canCreateNotes}
            canViewMedicalAvailability={
              props.permissions?.medical?.availability?.canView
            }
            grid={props.grid}
            rehydrateGrid={debounceResetGrid}
            isLoading={props.requestStatus === 'PENDING'}
            isReadyForMoreData={
              props.requestStatus !== 'PENDING' && !!props.grid.next_id
            }
            coachesReportV2Enabled={coachesReportV2Enabled}
            setRowSelectionModel={setRowSelectionModel}
            rowSelectionModel={rowSelectionModel}
            setModalIsOpen={setModalOpen}
            isModalOpen={modalOpen}
            isInMultiCopyNoteMode={isInMultiCopyNoteMode}
            setRequestStatus={(status) => props.onSetRequestStatus(status)}
          />
        )}
      </div>
    );
  };

  if (!isInitialDataLoaded) {
    switch (props.requestStatus) {
      case 'PENDING':
        return <DelayedLoadingFeedback />;
      case 'FAILURE':
        return <AppStatus status="error" />;
      default:
        return null;
    }
  }

  return coachesReportTab();
};

export const CoachesReportTabTranslated = withNamespaces()(CoachesReportTab);
export default CoachesReportTab;
