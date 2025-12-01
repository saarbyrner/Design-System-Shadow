// @flow
import { AppStatus } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import ListLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ListLayout';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import {
  Typography,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Alert,
} from '@kitman/playbook/components';
import { DataGridPro } from '@mui/x-data-grid-pro';

import useQAFormsList from '@kitman/modules/src/LeagueOperations/shared/hooks/useQAFormsList';
import { getConfig } from './utils/GridConfig';

export default () => {
  const {
    isPermitted,
    qaFormList,
    isSuccess,
    isLoading,
    isError,
    filterOptions,
    onSelectFilter,
    formFilter,
  } = useQAFormsList();
  const locationAssign = useLocationAssign();

  if (!isPermitted && isSuccess) {
    locationAssign('/');
  }

  const renderHeader = () => {
    return (
      <PageLayout.Header withTabs>
        <HeaderLayout.Content>
          <HeaderLayout.Title>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              QA Forms
            </Typography>
          </HeaderLayout.Title>
        </HeaderLayout.Content>
      </PageLayout.Header>
    );
  };

  const renderFilters = () => {
    return (
      <ListLayout.Filters>
        <FormControl variant="filled" sx={{ m: 1, width: '30ch' }}>
          <InputLabel id="form-category-select">Form type</InputLabel>
          <Select
            labelId="form-category-select"
            id="form-category-select"
            value={formFilter}
            label="Form filter"
            onChange={(event) => onSelectFilter(event.target.value)}
          >
            {filterOptions.map((filter) => {
              return (
                <MenuItem value={filter.key} key={filter.key}>
                  <Typography variant="body2">{filter.value}</Typography>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </ListLayout.Filters>
    );
  };

  const renderContent = () => {
    if (isError) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading) {
      return <AppStatus status="loading" isEmbed message="Loading..." />;
    }
    if (isSuccess && qaFormList) {
      const gridConfig = getConfig(qaFormList);

      return (
        <PageLayout.Content>
          {renderHeader()}

          <ListLayout>
            <Alert severity="warning" color="warning" variant="filled">
              Warning. This tool is indended for internal use only. You will not
              be able to submit any forms, but you should use this as a visual
              aid to help you QA the UI / UX of the selected form. If you have
              any concerns, contact League Operations
            </Alert>
            <ListLayout.Content>{renderFilters()}</ListLayout.Content>
            <DataGridPro
              columns={gridConfig.columns}
              rows={gridConfig.rows}
              rowCount={gridConfig.rows.length}
              isTableEmpty={gridConfig.rows.length === 0}
              noRowsMessage={gridConfig.emptyTableText}
              hideFooter
              sx={{
                background: colors.white,
                '.MuiDataGrid-row--detailPanelExpanded': {
                  background: colors.light_transparent_background,
                },
              }}
            />
          </ListLayout>
        </PageLayout.Content>
      );
    }
    return null;
  };

  return <PageLayout>{renderContent()}</PageLayout>;
};
