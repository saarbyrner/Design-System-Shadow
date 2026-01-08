// @flow
import {
  Box,
  DataGrid as MuiDataGrid,
  Alert,
  Collapse,
} from '@kitman/playbook/components';

import { MUI_DATAGRID_STYLES_OVERRIDE } from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import { getValidationMessageInPriority } from '@kitman/components/src/DocumentSplitter/src/shared/utils/validation';

// Types
import type {
  GridConfig,
  ValidationResults,
} from '@kitman/components/src/DocumentSplitter/src/shared/types';

type Props = {
  grid: GridConfig,
  validationResults: ValidationResults,
  validationFailed: boolean,
};

const autoHeight = () => 'auto';

const DetailsGrid = ({ grid, validationResults, validationFailed }: Props) => {
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Collapse in={validationFailed}>
          <Alert severity="error" color="error" variant="filled">
            {validationFailed &&
              getValidationMessageInPriority(validationResults)}
          </Alert>
        </Collapse>
      </Box>
      <MuiDataGrid
        columns={grid.columns}
        rows={grid.rows}
        isTableEmpty={grid.rows.length === 0}
        noRowsMessage={grid.emptyTableText}
        isFullyLoaded
        {...MUI_DATAGRID_STYLES_OVERRIDE}
        editMode={undefined}
        hideFooter
        autoHeight
        getRowHeight={autoHeight}
      />
    </>
  );
};

export default DetailsGrid;
