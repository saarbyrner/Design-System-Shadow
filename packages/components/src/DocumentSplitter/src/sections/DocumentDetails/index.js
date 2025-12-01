// @flow
import { withNamespaces } from 'react-i18next';

import { useState } from 'react';
import moment from 'moment';

import {
  Autocomplete,
  TextField,
  DatePicker,
  Grid2 as Grid,
} from '@kitman/playbook/components';
import { zIndices } from '@kitman/common/src/variables';
import { useGetDocumentNoteCategoriesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  renderInput,
  renderCheckboxes,
} from '@kitman/playbook/utils/Autocomplete';
import Errors from '@kitman/components/src/DocumentSplitter/src/components/Errors';
import { AthleteSelectorTranslated as AthleteSelector } from '@kitman/modules/src/Medical/shared/components/AthleteSelector';
import { DOCUMENT_DETAILS_DATA_KEY } from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import { sanitizeDate } from '@kitman/playbook/utils/DatePicker';

// Types
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { MedicalAttachmentCategory } from '@kitman/modules/src/Medical/shared/types/medical';
import type { Data, PartialData, Validation } from './types';

type Props = {
  data: Data,
  validation: Validation,
  handleChange: (data: PartialData) => void,
};

type InitialDocumentCategoriesData = Array<MedicalAttachmentCategory>;

const initialDocumentCategoriesData: InitialDocumentCategoriesData = [];

const DocumentDetails = ({
  data,
  validation,
  handleChange,
  t,
}: I18nProps<Props>) => {
  const [documentCategoriesDropdownOpen, setDocumentCategoriesDropdownOpen] =
    useState<boolean>(false);

  const {
    data: documentCategories = initialDocumentCategoriesData,
    isFetching: areDocumentCategoriesFetching,
  } = useGetDocumentNoteCategoriesQuery(undefined, {
    skip: !documentCategoriesDropdownOpen,
  });

  const hasDateError =
    !!validation.errors?.[DOCUMENT_DETAILS_DATA_KEY.documentDate]?.length;

  const hasCategoriesError =
    !!validation.errors?.[DOCUMENT_DETAILS_DATA_KEY.documentCategories]?.length;

  const hasPlayersError =
    !!validation.errors?.[DOCUMENT_DETAILS_DATA_KEY.players]?.length;

  return (
    <>
      <Errors
        errors={validation.hasErrors ? [t('Invalid document details')] : null}
        wrapInHelperText
      />
      <Grid container spacing={2}>
        <Grid xs={12}>
          <TextField
            value={data.fileName}
            label={t('File name')}
            onChange={(e) => {
              handleChange({
                [DOCUMENT_DETAILS_DATA_KEY.fileName]: e.target.value,
              });
            }}
            margin="none"
            fullWidth
            error={
              !!validation.errors?.[DOCUMENT_DETAILS_DATA_KEY.fileName]?.length
            }
          />
        </Grid>
        <Grid xs={12}>
          <DatePicker
            disableFuture
            label={t('Date of document')}
            value={data.documentDate ? moment(data.documentDate) : null}
            onChange={(date) => {
              handleChange({
                [DOCUMENT_DETAILS_DATA_KEY.documentDate]: sanitizeDate(date),
              });
            }}
            slotProps={{
              textField: {
                error: hasDateError,
                helperText: hasDateError
                  ? validation.errors[DOCUMENT_DETAILS_DATA_KEY.documentDate][0] // First error message
                  : undefined,
                clearable: true,
              },
              popper: {
                sx: {
                  zIndex: zIndices.selectMenu,
                },
              },
            }}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid xs={12}>
          <Autocomplete
            multiple
            fullWidth
            size="small"
            limitTags={1}
            disablePortal
            disableCloseOnSelect
            loading={areDocumentCategoriesFetching}
            onOpen={() => setDocumentCategoriesDropdownOpen(true)}
            onClose={() => setDocumentCategoriesDropdownOpen(false)}
            value={data.documentCategories}
            onChange={(e, values) => {
              handleChange({
                [DOCUMENT_DETAILS_DATA_KEY.documentCategories]: values,
              });
            }}
            options={
              !areDocumentCategoriesFetching
                ? documentCategories.map((category) => ({
                    id: category.id,
                    label: category.name,
                  }))
                : []
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) =>
              renderInput({
                params,
                label: t('Categories'),
                loading: areDocumentCategoriesFetching,
                error: hasCategoriesError,
              })
            }
            renderOption={renderCheckboxes}
            getOptionLabel={(option) => option.label}
            noOptionsText={t('No categories')}
          />
        </Grid>
        <Grid xs={12}>
          <AthleteSelector
            label={t('Players')}
            value={data.players}
            onChange={(values) =>
              handleChange({
                [DOCUMENT_DETAILS_DATA_KEY.players]: values,
              })
            }
            multiple
            disablePortal
            disabled={data.playerIsPreselected}
            error={hasPlayersError}
          />
        </Grid>
      </Grid>
    </>
  );
};

export const DocumentDetailsTranslated: ComponentType<Props> =
  withNamespaces()(DocumentDetails);
export default DocumentDetails;
