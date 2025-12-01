// @flow
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import {
  onOpenDocumentSidePanel,
  onResetSidePanelForm,
  onUpdateFilter,
  type DocumentsTabFilters,
} from '@kitman/modules/src/StaffProfile/shared/redux/slices/documentsTabSlice';
import { getGenericDocumentsCategoriesFactory } from '@kitman/services/src/services/documents/generic/redux/selectors/genericDocumentsSelectors';
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from '@kitman/playbook/components';
import { getFiltersFactory } from '@kitman/modules/src/StaffProfile/shared/redux/selectors/documentsTabSelectors';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getHeaderLabels, documentStatuses } from './utils/helpers';

export type TranslatedProps = I18nProps<{}>;

const DocumentsHeader = ({ t }: TranslatedProps) => {
  const dispatch = useDispatch();
  const {
    search,
    organisation_generic_document_categories: categories,
    statuses,
  }: DocumentsTabFilters = useSelector(getFiltersFactory());
  const genericDocumentCategories = useSelector(
    getGenericDocumentsCategoriesFactory()
  );
  const labels = getHeaderLabels();

  const handleAddDocumentClick = () => {
    // Open the side panel on create mode
    dispatch(onResetSidePanelForm());
    dispatch(onOpenDocumentSidePanel());
  };

  const { data: permissions }: { data: PermissionsType } =
    useGetPermissionsQuery();

  return (
    <Grid container justifyContent="space-between" mb={2}>
      <Box columnGap="0.5rem" display="flex">
        <TextField
          variant="filled"
          label={labels.search}
          value={search}
          sx={{
            width: '18.75rem',
          }}
          onChange={({ target: { value } }) =>
            dispatch(onUpdateFilter({ key: 'search', value }))
          }
        />
        <FormControl fullWidth={false}>
          <InputLabel id="category-filter-select-label">
            {labels.category}
          </InputLabel>
          <Select
            multiple
            label={labels.category}
            labelId="category-filter-select-label"
            value={categories}
            onChange={({ target: { value } }) => {
              dispatch(
                onUpdateFilter({
                  key: 'organisation_generic_document_categories',
                  value,
                })
              );
            }}
            sx={{ width: '11.25rem' }}
          >
            {genericDocumentCategories?.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth={false}>
          <InputLabel id="status-filter-select-label">
            {labels.status}
          </InputLabel>
          <Select
            multiple
            labelId="status-filter-select-label"
            label={labels.status}
            value={statuses}
            onChange={({ target: { value } }) =>
              dispatch(onUpdateFilter({ key: 'statuses', value }))
            }
            sx={{ width: '11.25rem' }}
          >
            {documentStatuses.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {permissions.settings.canManageStaffUsers && (
        <Grid item>
          <Button onClick={handleAddDocumentClick}>{t('Add')}</Button>
        </Grid>
      )}
    </Grid>
  );
};

export const DocumentsHeaderTranslated: ComponentType<{}> =
  withNamespaces()(DocumentsHeader);
export default DocumentsHeader;
