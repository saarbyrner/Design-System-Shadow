// @flow
import { useState, useEffect, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  Autocomplete,
  Box,
  Checkbox,
  DataGrid,
  TextField,
} from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import { DateRangeTranslated as DateRange } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/Filters/DateRange';
import { FormSelectorTranslated as FormSelector } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/Filters/FormSelector';
import { AthleteSelectorTranslated as Athletes } from '@kitman/modules/src/Medical/shared/components/AthleteSelector';
import Category from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/Filters/Category/Category';
import { AthleteStatusFilterTranslated as AthleteStatusFilter } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/Filters/AthleteStatusFilter';
import { formAnswerSetStatuses } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/constants';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { useFormAnswerSets } from '@kitman/modules/src/FormAnswerSets/utils/hooks/useFormAnswerSets';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useDeleteFormAnswersSetAction } from '@kitman/modules/src/HumanInput/pages/genericFormRenderer/GenericFormRenderer/utils/hooks';
import { getCompletedColumns } from '@kitman/modules/src/FormAnswerSets/utils/helpers';
import {
  setStatusesFilter,
  setAthleteFilter,
} from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';
import {
  selectStatusesFilter,
  selectAthleteFilter,
  selectAthleteStatusFilter,
} from '@kitman/modules/src/FormAnswerSets/redux/selectors/formAnswerSetsSelectors';
import { useGetFormAnswerSetsAthletesQuery } from '@kitman/services/src/services/formAnswerSets';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Option } from '@kitman/playbook/types';
import DataGridSkeleton from '@kitman/modules/src/HumanInput/shared/components/DataGridSkeleton';

type Props = {};

const CompletedTab = ({ t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();
  const statusesFilter = useSelector(selectStatusesFilter);
  const athleteId = useSelector(selectAthleteFilter);
  const athleteStatus = useSelector(selectAthleteStatusFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [status, setStatus] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState<
    Option | Array<Option>
  >([]);
  const { rows, isLoading, meta, refetch } = useFormAnswerSets(
    currentPage,
    rowsPerPage
  );

  const { data: freeAgentAthletesResponse } = useGetFormAnswerSetsAthletesQuery(
    { athlete_status_at_assignment: 'free_agent' },
    { skip: athleteStatus !== 'free_agent' }
  );

  const freeAgentAthletes =
    freeAgentAthletesResponse?.athletes?.map((athlete) => ({
      id: athlete.id,
      label: athlete.fullname,
    })) || [];

  const {
    data: permissions = DEFAULT_CONTEXT_VALUE.permissions,
  }: { data: PermissionsType } = useGetPermissionsQuery();

  const canDeleteForms = permissions.eforms?.canDeleteForms;

  const { confirmationModal, isDeleteLoading, openModal } =
    useDeleteFormAnswersSetAction({
      isDeleteDraftAction: false,
      refetch,
      isStaffFlow: true,
    });

  const columns = getCompletedColumns({
    isDeleteLoading,
    openModal,
    canDeleteForms,
    showLatestPDF: athleteStatus === 'free_agent',
  });

  // Sync local status state with Redux state
  useEffect(() => {
    if (!statusesFilter || statusesFilter.length === 0) {
      setStatus([]);
    } else {
      const statusObjects = formAnswerSetStatuses.filter((statusObj) =>
        statusesFilter.includes(statusObj.id)
      );
      setStatus(statusObjects);
    }
  }, [statusesFilter]);

  useEffect(() => {
    if (!athleteId) {
      setSelectedAthletes([]);
    }
  }, [athleteId]);

  const handleAthleteChange = (value: Option | Array<Option>) => {
    const athlete = Array.isArray(value) ? value[0] : value;
    setSelectedAthletes(athlete);
    dispatch(setAthleteFilter(athlete?.id || null));
    trackEvent('Staff - Completed Forms Filter Athlete/Player Used');
  };

  return (
    <>
      <Box
        display="flex"
        gap="0.5rem"
        sx={{
          backgroundColor: 'white',
          padding: '0.5rem',
        }}
      >
        {window.getFlag('pm-eforms-tryout') &&
          permissions.eforms?.canViewTryout && (
            <AthleteStatusFilter isPlayerUsage={false} />
          )}
        <Athletes
          multiple={false}
          label={t('Athletes')}
          value={selectedAthletes}
          onChange={handleAthleteChange}
          options={
            athleteStatus === 'free_agent' ? freeAgentAthletes : undefined
          }
          sx={{
            width: '20rem',
          }}
        />
        <FormSelector
          handleTrackEvent={() => {
            trackEvent('Completed Forms filtered by form type');
          }}
        />
        <Autocomplete
          multiple
          value={status}
          onChange={(event, values) => {
            setStatus(values);
            dispatch(setStatusesFilter(values.map((value) => value.id)));
            trackEvent('Completed forms filtered by status');
          }}
          options={formAnswerSetStatuses}
          renderInput={(params) => (
            <TextField {...params} label={t('Status')} />
          )}
          size="small"
          renderOption={(props, option, { selected }) => {
            const { id, ...optionProps } = props;
            return (
              <li key={id} {...optionProps}>
                <Checkbox
                  icon={
                    <KitmanIcon name={KITMAN_ICON_NAMES.CheckBoxOutlineBlank} />
                  }
                  checkedIcon={<KitmanIcon name={KITMAN_ICON_NAMES.CheckBox} />}
                  style={{ marginRight: '0.5rem' }}
                  checked={selected}
                />
                {option.label}
              </li>
            );
          }}
          sx={{ width: '15rem' }}
        />
        <Category
          categoryLabelTranslated={t('Category')}
          handleTrackEvent={() => {
            trackEvent('Completed forms filtered by category');
          }}
        />
        <DateRange
          handleTrackEvent={() => {
            trackEvent('Completed forms filtered by date range');
          }}
        />
      </Box>
      {isLoading ? (
        <DataGridSkeleton
          rowCount={rowsPerPage}
          columnCount={6}
          columnWidths={[13, 40, 13, 13, 13, 8]}
        />
      ) : (
        <Box
          sx={{
            border: `1px solid ${colors.neutral_300}`,
            backgroundColor: colors.white,
            overflowX: 'auto',
          }}
        >
          {confirmationModal}
          <DataGrid
            columns={columns}
            pinnedColumns={{ right: ['actions'] }}
            rows={rows}
            loading={isLoading}
            pagination
            asyncPagination
            pageNumber={meta.currentPage - 1} // MUI's pages are 0-indexed
            pageSize={rowsPerPage}
            rowCount={meta.totalCount}
            onPaginationModelChange={(nextPage, pageSize) => {
              setCurrentPage(nextPage + 1); // Our pages are 1-indexed
              setRowsPerPage(pageSize);
            }}
          />
        </Box>
      )}
    </>
  );
};

export const CompletedTabTranslated: ComponentType<Props> =
  withNamespaces()(CompletedTab);

export default CompletedTab;
