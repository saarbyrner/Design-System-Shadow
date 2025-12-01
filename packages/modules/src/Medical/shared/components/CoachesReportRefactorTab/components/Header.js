// @flow

import { useState } from 'react';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import { cellNotBeingEditedValue } from '@kitman/modules/src/Medical/shared/components/CoachesReportRefactorTab/utils/utils';
import type { Translation } from '@kitman/common/src/types/i18n';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import {
  Typography,
  Box,
  Tooltip,
  Button,
  DateCalendar,
  Popover,
} from '@kitman/playbook/components';
import style from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/styles';
import type { FiltersType, CoachesReportPayload } from '../types';
import Filters from './Filters';
import NoteCreationHeader from './NoteCreationHeader';

type ParentCoachesReportHeaderProps = {
  t: Translation,
  filters: FiltersType,
  dataGridCurrentDate: string,
  rowSelectionModel: Array<number>,
  canCreateNotes: boolean,
  canExport: boolean,
  updateCoachesNotePayLoad: Function,
  setDataGridCurrentDate: Function,
  updatePayload: (newPayload: CoachesReportPayload) => void,
  rehydrateGrid: () => void,
  isCoachesNotesFetching: boolean,
  isCoachesNotesError: boolean,
  isBulkMedicalNotesSaveError: boolean,
  setModalOpen: (boolean) => void,
  isLoading: boolean,
  setRowSelectionModel: (Array<number>) => void,
  setEditingCellId: (cellId: number) => void,
};

const ParentCoachesReportHeader = ({
  t,
  filters,
  dataGridCurrentDate,
  rowSelectionModel,
  canCreateNotes,
  canExport,
  updateCoachesNotePayLoad,
  setDataGridCurrentDate,
  updatePayload,
  rehydrateGrid,
  isCoachesNotesFetching,
  isCoachesNotesError,
  isBulkMedicalNotesSaveError,
  setModalOpen,
  isLoading,
  setRowSelectionModel,
  setEditingCellId,
}: ParentCoachesReportHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateSelectedOnCalendar, setDateSelectedOnCalendar] = useState<string>(
    moment().toISOString()
  );

  const tabHeader = t('Daily Status Report - {{date}}', {
    date: formatStandard({ date: moment(dataGridCurrentDate) }),
  });

  const handleCopyLastReport = (athleteIds: Array<number> = []): void => {
    const payload = {
      athleteIds,
      includeCopiedFrom: true,
      organisationAnnotationTypes: [
        'OrganisationAnnotationTypes::DailyStatusNote',
      ],
      annotationDate: dataGridCurrentDate.toString(),
    };

    updateCoachesNotePayLoad(payload);
  };

  const handleCalendarOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onCalendarClose = () => {
    setAnchorEl(null);
  };

  // Closes the inline note creation and clears any selected rows
  const resetGridUi = () => {
    setRowSelectionModel([]);
    setEditingCellId(cellNotBeingEditedValue);
  };

  const dateCycle = (direction: 'left' | 'right'): void => {
    const currentDate = moment(dataGridCurrentDate);
    const newDate =
      direction === 'left'
        ? currentDate.clone().subtract(1, 'days').toISOString()
        : currentDate.clone().add(1, 'days').toISOString();

    setDataGridCurrentDate(newDate);
    setDateSelectedOnCalendar(newDate);
    updatePayload({
      filters: {
        ...filters,
        report_date: newDate,
      },
      next_id: null,
    });
    rehydrateGrid();
    resetGridUi();
  };

  // Sets the value to state as the user clicks through the calendar
  const onCalendarDateChange = (dateFromCalendar: ?Date): void => {
    const newDate = dateFromCalendar
      ? moment(dateFromCalendar).toISOString()
      : null;
    const currentSelectedDate = dateSelectedOnCalendar
      ? moment(dateSelectedOnCalendar)
      : null;

    if (newDate && !currentSelectedDate?.isSame(moment(newDate))) {
      setDateSelectedOnCalendar(newDate);
      setDataGridCurrentDate(newDate);
      updatePayload({
        filters: {
          ...filters,
          report_date: newDate,
        },
        next_id: null,
      });
      rehydrateGrid();
      resetGridUi();
    }
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
              value={moment(dateSelectedOnCalendar)}
            />
          </LocalizationProvider>
        </Popover>
      </Box>
    );
  };

  const renderDateCycleAndCalendar = () => {
    return (
      <Box sx={{ display: 'flex' }}>
        <Typography>
          {formatStandard({ date: moment(dataGridCurrentDate) })}
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Tooltip title={t('Previous day')}>
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
          <Tooltip title={t('Next day')}>
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
          <Tooltip title={t('Open Calendar')}>
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

  return (
    <Box
      component="header"
      sx={{
        ...style.header,
        ...(isLoading && style.disabledElement),
      }}
    >
      <Box sx={style.titleContainer}>
        <Typography variant="h3" sx={style.title}>
          {tabHeader}
        </Typography>
        {renderDateCycleAndCalendar()}
      </Box>
      {!rowSelectionModel.length ? (
        <Filters
          t={t}
          filters={filters}
          updatePayload={updatePayload}
          dataGridCurrentDate={dataGridCurrentDate}
          rehydrateGrid={rehydrateGrid}
          canCreateNotes={canCreateNotes}
          canExport={canExport}
          handleCopyLastReport={handleCopyLastReport}
          isCoachesNotesFetching={isCoachesNotesFetching}
          isCoachesNotesError={isCoachesNotesError}
          isBulkMedicalNotesSaveError={isBulkMedicalNotesSaveError}
        />
      ) : (
        <NoteCreationHeader
          t={t}
          rowSelectionModel={rowSelectionModel}
          canCreateNotes={canCreateNotes}
          setModalOpen={setModalOpen}
          handleCopyLastReport={handleCopyLastReport}
          isCoachesNotesError={isCoachesNotesError}
        />
      )}
    </Box>
  );
};

export default ParentCoachesReportHeader;
