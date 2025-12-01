// @flow
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DataGrid, Button, Box, Tooltip } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { colors } from '@kitman/common/src/variables';
import { setShowFormBuilder } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { getShowFormBuilder } from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import i18n from '@kitman/common/src/utils/i18n';
import Header from '@kitman/modules/src/HumanInput/shared/components/Header';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ComponentType } from 'react';
import DataGridSkeleton from '@kitman/modules/src/HumanInput/shared/components/DataGridSkeleton';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import Filters from './Filters';
import { FormBuilderTranslated as FormBuilder } from '../FormBuilder';
import { useFormTemplates, useDeleteFormTemplateAction } from './utils/hooks';
import { getColumns } from './utils/helpers';
import FormTemplateDrawer from './FormTemplateDrawer';
import ScheduleDrawer from './ScheduleFormDrawer';
import AssignAthletesDrawer from './AssignAthletesDrawer';
import AssignFreeAgentsDrawer from './AssignFreeAgentsDrawer';
import {
  toggleIsFormTemplateDrawerOpen,
  toggleIsScheduleDrawerOpen,
} from '../redux/slices/formTemplatesSlice';

const styles = {
  pageContainer: {
    backgroundColor: colors.background,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1rem',
  },
  tableContainer: {
    border: `1px solid ${colors.neutral_300}`,
    backgroundColor: colors.white,
    // Ensure horizontal scrolling for the DataGrid
    overflowX: 'auto',
  },
};

type Props = {};

const FormTemplates = ({ t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();
  const locationAssign = useLocationAssign();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { rows, meta, isLoading } = useFormTemplates(currentPage, rowsPerPage);
  const shouldShowFormBuilder = useSelector(getShowFormBuilder);

  const { confirmationModal, isDeleteLoading } = useDeleteFormTemplateAction();

  const {
    data: permissions = DEFAULT_CONTEXT_VALUE.permissions,
  }: { data: PermissionsType } = useGetPermissionsQuery();

  const columns = getColumns(dispatch, isDeleteLoading, permissions?.eforms);

  return shouldShowFormBuilder ? (
    <FormBuilder />
  ) : (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        sx={{ backgroundColor: colors.white }}
      >
        <Header title={t('Form Templates')} />
        {window.getFlag('cp-forms-categories') && (
          <Tooltip title={t('Settings')}>
            <Button
              color="secondary"
              size="small"
              onClick={() => locationAssign('/forms/form_templates/settings')}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.SettingsOutlined} />
            </Button>
          </Tooltip>
        )}
      </Box>

      <FormTemplateDrawer
        onClickingCreate={() => {
          dispatch(toggleIsFormTemplateDrawerOpen());
          dispatch(setShowFormBuilder(true));
          trackEvent('Form Template - Form Creation Started ');
        }}
      />
      <ScheduleDrawer
        handleSaveButton={() => {
          dispatch(toggleIsScheduleDrawerOpen());
        }}
      />
      <AssignAthletesDrawer />
      <AssignFreeAgentsDrawer />
      <div css={styles.pageContainer}>
        <Box display="flex" justifyContent="space-between">
          <Filters />
          <Button
            onClick={() => {
              dispatch(toggleIsFormTemplateDrawerOpen());
            }}
            color="secondary"
          >
            {i18n.t('Create Form')}
          </Button>
        </Box>
        {isLoading ? (
          <DataGridSkeleton
            rowCount={rowsPerPage}
            columnCount={8}
            columnWidths={[23, 23, 8, 8, 8, 12, 12, 8]}
          />
        ) : (
          <div css={styles.tableContainer}>
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
          </div>
        )}
      </div>
    </>
  );
};

export const FormTemplatesTranslated: ComponentType<Props> =
  withNamespaces()(FormTemplates);

export default FormTemplates;
