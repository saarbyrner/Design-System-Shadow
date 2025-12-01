// @flow
import { useState, useEffect, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { Box, DataGridPremium } from '@kitman/playbook/components';

import { colors } from '@kitman/common/src/variables';
import { DateRangeTranslated as DateRange } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/Filters/DateRange';
import { FormSelectorTranslated as FormSelector } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/Filters/FormSelector';
import { AthleteSelectorTranslated as Athletes } from '@kitman/modules/src/Medical/shared/components/AthleteSelector';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { useFormAnswerSetsByAthlete } from '@kitman/modules/src/FormAnswerSets/utils/hooks/useFormAnswerSetsByAthlete';
import {
  setAthleteFilter,
  setDateRangeFilter,
  setFormFilter,
} from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';
import {
  selectAthleteFilter,
  selectDateRangeFilter,
  selectFormFilter,
} from '@kitman/modules/src/FormAnswerSets/redux/selectors/formAnswerSetsSelectors';
import {
  getComplianceColumns,
  transformDataForTree,
} from '@kitman/modules/src/FormAnswerSets/utils/helpers';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Option } from '@kitman/playbook/types';

import DataGridSkeleton from '@kitman/modules/src/HumanInput/shared/components/DataGridSkeleton';
import { useGridApiRef } from '@mui/x-data-grid-premium';

type Props = {};

const STORAGE_KEY = 'complianceTabFilters';

const ComplianceTab = ({ t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();
  const apiRef = useGridApiRef();
  const athleteFilterId = useSelector(selectAthleteFilter);
  const dateRangeFilter = useSelector(selectDateRangeFilter);
  const formFilter = useSelector(selectFormFilter);
  const [selectedAthletes, setSelectedAthletes] = useState<
    Option | Array<Option>
  >([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [storedAthletes, setStoredAthletes] = useState(null);
  const [athletesRestored, setAthletesRestored] = useState(false);

  const startDate = dateRangeFilter?.start_date;
  const endDate = dateRangeFilter?.end_date;

  // Extract athlete IDs from selected athletes
  let athleteIds;
  if (Array.isArray(selectedAthletes)) {
    athleteIds = selectedAthletes
      .map((athlete) => athlete?.id)
      .filter(Boolean)
      .map((id) => parseInt(id, 10));
  } else if (selectedAthletes?.id) {
    athleteIds = [parseInt(selectedAthletes.id, 10)];
  } else {
    athleteIds = undefined;
  }

  // Extract form template IDs from form filter
  let formTemplateIds;
  if (Array.isArray(formFilter)) {
    formTemplateIds = formFilter;
  } else if (formFilter) {
    formTemplateIds = [formFilter];
  } else {
    formTemplateIds = undefined;
  }

  const isReady = isInitialized && athletesRestored;

  // Use server-side pagination - only call when ready
  const { rows, isLoading, meta } = useFormAnswerSetsByAthlete(
    paginationModel.page + 1,
    paginationModel.pageSize,
    athleteIds,
    formTemplateIds,
    startDate,
    endDate,
    !isReady
  );

  // Transform data for tree structure display
  const treeRows = transformDataForTree(rows);

  const handleAthleteClick = (rowId) => {
    const node = apiRef.current.getRowNode(rowId);
    if (node && node.type === 'group') {
      apiRef.current.setRowChildrenExpansion(rowId, !node.childrenExpanded);
    }
  };

  const columns = getComplianceColumns(handleAthleteClick);

  useEffect(() => {
    // Load filters from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      // Prepopulate date range filter with current calendar month if no stored data
      const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
      const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
      
      dispatch(setDateRangeFilter({
        start_date: startOfMonth,
        end_date: endOfMonth,
      }));
      setIsInitialized(true);
      setAthletesRestored(true);
      return;
    }

    try {
      const { athletes, forms, dateRange } = JSON.parse(stored);
      
      // Store athletes for later restoration
      if (athletes) {
        setStoredAthletes(athletes);
        let idsToDispatch;
        if (Array.isArray(athletes)) {
          idsToDispatch = athletes.map((athlete) => athlete?.id).filter(Boolean);
        } else if (athletes?.id) {
          idsToDispatch = [athletes.id];
        } else {
          idsToDispatch = null;
        }
        dispatch(setAthleteFilter(idsToDispatch));
      } else {
        setAthletesRestored(true);
      }
      
      if (forms) {
        dispatch(setFormFilter(forms));
      }
      
      if (dateRange) {
        dispatch(setDateRangeFilter(dateRange));
      } else {
        // Only set default date range if nothing stored
        const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
        const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
        dispatch(setDateRangeFilter({
          start_date: startOfMonth,
          end_date: endOfMonth,
        }));
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to load filters from localStorage:', error);
      setIsInitialized(true);
      setAthletesRestored(true);
    }
  }, [dispatch]);

  // Restore athletes after initialization
  useEffect(() => {
    if (isInitialized && storedAthletes) {
      const timer = setTimeout(() => {
        setSelectedAthletes(storedAthletes);
        setStoredAthletes(null);
        setAthletesRestored(true);
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isInitialized, storedAthletes]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      const filtersToStore = {
        athletes: selectedAthletes,
        forms: formFilter,
        dateRange: dateRangeFilter,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtersToStore));
    } catch (error) {
      console.error('Failed to save filters to localStorage:', error);
    }
  }, [selectedAthletes, formFilter, dateRangeFilter, isInitialized]);

  useEffect(() => {
    if (!athleteFilterId && !storedAthletes) {
      setSelectedAthletes([]);
    }
  }, [athleteFilterId, storedAthletes]);

  const handleAthleteChange = (value: Option | Array<Option>) => {
    setSelectedAthletes(value);
    let idsToDispatch;
    if (Array.isArray(value)) {
      idsToDispatch = value.map((athlete) => athlete?.id).filter(Boolean);
    } else if (value?.id) {
      idsToDispatch = [value.id];
    } else {
      idsToDispatch = null;
    }
    dispatch(setAthleteFilter(idsToDispatch));
    trackEvent('Compliance grid Filter Athlete/Player Used');
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
        <Athletes
          multiple
          label={t('Athletes')}
          value={selectedAthletes}
          onChange={handleAthleteChange}
          sx={{
            width: '20rem',
          }}
          limitTags={1}
        />
        <FormSelector
          multiple
          handleTrackEvent={() => {
            trackEvent('Compliance grid filtered by form type');
          }}
          limitTags={1}
        />
        <DateRange
          handleTrackEvent={() => {
            trackEvent('Compliance grid filtered by date range');
          }}
        />
      </Box>
      {!isReady || isLoading ? (
        <DataGridSkeleton
          rowCount={25}
          columnCount={3}
          columnWidths={[40, 40, 20]}
        />
      ) : (
        <Box
          sx={{
            border: `1px solid ${colors.neutral_300}`,
            backgroundColor: colors.white,
            overflowX: 'auto',
          }}
        >
          <DataGridPremium
            apiRef={apiRef}
            columns={columns}
            rows={treeRows}
            getRowId={(row) => row.id}
            loading={isLoading}
            autoHeight
            pagination
            asyncPagination
            rowCount={Number(meta?.totalCount) || 0}
            pageNumber={paginationModel.page}
            pageSize={paginationModel.pageSize}
            onAsyncPaginationModelChange={(page, pageSize) => {
              setPaginationModel({ page, pageSize });
            }}
            pageSizeOptions={[10, 25, 50]}
            treeData
            getTreeDataPath={(row) => row.path}
            defaultGroupingExpansionDepth={0}
            groupingColDef={{
              headerName: '',
              width: 54,
              minWidth: 54,
              maxWidth: 54,
              hideable: false,
              disableColumnMenu: true,
            }}
            showColumnSelectorButton={false}
            showFilterButton={false}
            showDensitySelectorButton={false}
            showExportButton={false}
            showQuickFilter={false}
          />
        </Box>
      )}
    </>
  );
};

export const ComplianceTabTranslated: ComponentType<Props> =
  withNamespaces()(ComplianceTab);

export default ComplianceTab;
