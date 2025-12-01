// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { DataGrid as MuiDataGrid, Box } from '@kitman/playbook/components';
import { AppStatus } from '@kitman/components';
import TabLayout from '@kitman/components/src/TabLayout';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import useAthletesConsentGrid from '@kitman/modules/src/ConditionalFields/shared/hooks/useAthletesConsentGrid';
import {
  CONSENTABLE_TYPE,
  CONSENTING_TO,
} from '@kitman/common/src/types/Consent';
import type { OrgLevelProps } from '@kitman/modules/src/ConditionalFields/shared/types';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { FiltersTranslated as Filters } from '@kitman/modules/src/ConditionalFields/OrganisationApp/src/components/ClubConsentTab/Filters';
import DateSelection from '@kitman/modules/src/ConditionalFields/shared/components/DateSelection';
import { ConsentOverlapDialogTranslated as ConsentOverlapDialog } from '@kitman/modules/src/ConditionalFields/OrganisationApp/src/components/ClubConsentTab/ConsentOverlapDialog';
import { useSaveAthletesConsentMutation } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';

import styles from './styles';

const ClubConsentTab = ({ t }: I18nProps<OrgLevelProps>) => {
  const {
    isAthleteListError,
    isAthleteListFetching,
    grid,
    onSearch,
    onUpdateFilter,
    meta,
  } = useAthletesConsentGrid({
    consentableType: CONSENTABLE_TYPE.Organisation,
  });

  const { trackEvent } = useEventTracking();

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [dateRange, setDateRange] = useState([null, null]);
  const [showConsentOverlapDialog, setShowConsentOverlapDialog] =
    useState(false);
  // Array, contains athletes that are not consented, sent as 409 conflict by the API
  const [notConsentedAthletes, setNotConsentedAthletes] = useState([]);
  const [saveAthletesConsent] = useSaveAthletesConsentMutation();

  const [startDate, endDate] = dateRange;

  const dispatch = useDispatch();

  const handleCloseDialog = () => {
    setShowConsentOverlapDialog(false);
    setSelectionModel([]);
    setNotConsentedAthletes([]);
    setDateRange([null, null]);
  };

  const filterAthletesToConsent = (notConsented) =>
    selectionModel.filter(
      (id) => !notConsented.map((athlete) => athlete.athlete_id).includes(id)
    );

  const idsNeedingConsent =
    notConsentedAthletes.length > 0
      ? filterAthletesToConsent(notConsentedAthletes)
      : selectionModel;
  const handleSaveAthletesConsent = () => {
    trackEvent(performanceMedicineEventNames.clickedAddConsentRange, {
      ...determineMedicalLevelAndTab(),
      isMulti: true,
    });

    saveAthletesConsent({
      athlete_ids: idsNeedingConsent,
      consentable_type: CONSENTABLE_TYPE.Organisation,
      consenting_to: CONSENTING_TO.injury_surveillance_export,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
    })
      .unwrap()
      .then(() => {
        dispatch(
          add({
            id: 'save-athletes-consent-success',
            title: t('Consent Updated'),
            status: 'SUCCESS',
          })
        );
        handleCloseDialog();
        trackEvent(performanceMedicineEventNames.addedConsentRange, {
          ...determineMedicalLevelAndTab(),
          isMulti: true,
        });
      })
      .catch((error) => {
        if (error.status === statusCodes.conflict) {
          setShowConsentOverlapDialog(true);
          // error.error is an array of athletes that are not consented
          setNotConsentedAthletes(error.error);
        } else {
          dispatch(
            add({
              id: 'save-athletes-consent-error',
              title: t('Consent Update Failed'),
              status: 'ERROR',
            })
          );
        }
      });
  };

  const handleSelectionModelChange = (newSelection) => {
    setSelectionModel(newSelection);
  };

  const muiGridProps = {
    rowSelectionModel: selectionModel,
    onRowSelectionModelChange: handleSelectionModelChange,
    rowSelection: true,
    disableRowSelectionOnClick: true,
    sx: {
      outline: 'none',
      border: 0,
      boxShadow: 0,
      '.MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell':
        {
          overflow: 'visible',
        },
      '.MuiDataGrid-columnHeader:focus, .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within':
        {
          outline: 'none',
        },
    },
  };

  const renderContent = () => {
    if (isAthleteListError) {
      return <AppStatus status="error" />;
    }
    const gridPageSize = 100;
    const pageNumber =
      meta.current_page === 0 ? meta.current_page : meta.current_page - 1;
    return (
      <Box
        sx={{
          width: '100%',
          height: `calc(100vh - ${convertPixelsToREM(345)})`,
        }}
      >
        <MuiDataGrid
          loading={isAthleteListFetching}
          columns={grid.columns}
          rows={grid.rows}
          rowCount={meta.total_count}
          pageSize={gridPageSize}
          pageNumber={pageNumber}
          checkboxSelection
          asyncPagination
          pagination
          pageSizeOptions={[gridPageSize]}
          onPaginationModelChange={(selectedPage) => {
            onUpdateFilter({ page: selectedPage + 1 });
          }}
          noRowsMessage={grid.emptyTableText}
          {...muiGridProps}
        />
      </Box>
    );
  };

  const renderGridSelection = () => {
    return (
      <div css={styles.consentActions}>
        <span css={styles.countText}>
          {selectionModel.length} {t('selected')}
        </span>
        <DateSelection
          t={t}
          onDateSelection={setDateRange}
          date={dateRange}
          onCancel={() => setDateRange([null, null])}
          onSave={() => {
            handleSaveAthletesConsent();
          }}
          isDateRange
        >
          <span>{t('New Consent range')}</span>
          <KitmanIcon name={KITMAN_ICON_NAMES.CalendarTodayOutlined} />
        </DateSelection>
      </div>
    );
  };

  return (
    <TabLayout>
      <TabLayout.Body shouldMinimizeEmptySpaces>
        <TabLayout.Header>
          <TabLayout.Title>
            <Box pt={3} pb={2} px={2}>
              {t('Consent')}
            </Box>
          </TabLayout.Title>
        </TabLayout.Header>
        <Box px={2}>
          {selectionModel.length > 0 ? (
            renderGridSelection()
          ) : (
            <Filters onSearch={onSearch} onUpdateFilter={onUpdateFilter} />
          )}
        </Box>
        <ConsentOverlapDialog
          isOpen={showConsentOverlapDialog}
          selectedNumber={selectionModel.length}
          notConsentedAthletes={notConsentedAthletes}
          onSave={handleSaveAthletesConsent}
          onCancel={handleCloseDialog}
        />
        <TabLayout.Content>{renderContent()}</TabLayout.Content>
      </TabLayout.Body>
    </TabLayout>
  );
};

export const ClubConsentTabTranslated = withNamespaces()(ClubConsentTab);
export default ClubConsentTab;
