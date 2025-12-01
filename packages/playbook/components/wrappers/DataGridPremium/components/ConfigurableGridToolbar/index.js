// @flow
import { type Node } from 'react';
import { Box } from '@kitman/playbook/components';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';

export type ConfigurableGridToolbarProps = {|
  showColumnSelectorButton?: boolean,
  showFilterButton?: boolean,
  showDensitySelectorButton?: boolean,
  showExportButton?: boolean,
  showQuickFilter?: boolean,
  excelExportOptions?: Object,
  quickFilterProps?: Object,
  // Allow other props to be passed to GridToolbarContainer
  [key: string]: any,
|};

const ConfigurableGridToolbar = ({
  showColumnSelectorButton,
  showFilterButton,
  showDensitySelectorButton,
  showExportButton,
  showQuickFilter,
  excelExportOptions,
  quickFilterProps,
  ...other
}: ConfigurableGridToolbarProps): Node => {
  return (
    <GridToolbarContainer {...other}>
      <>
        {showColumnSelectorButton && <GridToolbarColumnsButton />}
        {showFilterButton && <GridToolbarFilterButton />}
        {showDensitySelectorButton && <GridToolbarDensitySelector />}
        {showExportButton && (
          <GridToolbarExport excelExportOptions={excelExportOptions} />
        )}
      </>
      <Box sx={{ flexGrow: 1 }} />
      {showQuickFilter && <GridToolbarQuickFilter {...quickFilterProps} />}
    </GridToolbarContainer>
  );
};

export default ConfigurableGridToolbar;
