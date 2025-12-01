// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import moment, { Moment } from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import uniqBy from 'lodash/uniqBy';
import {
  Box,
  Typography,
  Button,
  Autocomplete,
  IconButton,
  Checkbox,
  DateRangePicker,
  SingleInputDateRangeField,
  Popper,
  Grid2 as Grid,
} from '@kitman/playbook/components';
import { AthleteSelectorTranslated as AthleteSelector } from '@kitman/modules/src/Medical/shared/components/AthleteSelector';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  useGetMedicalAttachmentsFileTypesQuery,
  useGetDocumentNoteCategoriesQuery,
  useSearchMedicalEntityAttachmentsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  selectData,
  selectValidation,
  SEND_DRAWER_DATA_KEY,
  type DataKey,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import { mapFilesToOptions } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import type { Option } from '@kitman/playbook/types';
import type { Options } from '@kitman/components/src/Select';
import type { MedicalAttachmentCategory } from '@kitman/modules/src/Medical/shared/types/medical';
import type { EntityAttachmentSearchResponse } from '@kitman/services/src/services/medical/searchMedicalEntityAttachments';
import Errors from '@kitman/modules/src/ElectronicFiles/shared/components/Errors';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import {
  maxNumberOfFiles,
  maxFileSizeInBytes,
  minCharactersToSearch,
} from '@kitman/modules/src/ElectronicFiles/shared/consts';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { fileGroupToIcon } from '@kitman/common/src/utils/mediaHelper';
import { zIndices } from '@kitman/common/src/variables';
import {
  renderInput,
  renderCheckboxes,
} from '@kitman/playbook/utils/Autocomplete';
import type { DateRange } from '@kitman/common/src/types';

type Props = {
  handleChange: (
    field: DataKey,
    value: Option | Array<Option> | ?DateRange
  ) => void,
  handleAttachSelectedFiles: () => void,
  maxFiles?: number,
};

type InitialDocumentCategoriesData = Array<MedicalAttachmentCategory>;
type InitialDocumentFileTypesData = Array<Options>;
type InitialFilesData = EntityAttachmentSearchResponse;

const initialDocumentCategoriesData: InitialDocumentCategoriesData = [];
const initialDocumentFileTypesData: InitialDocumentFileTypesData = [];
const initialFilesData: InitialFilesData = {
  entity_attachments: [],
  meta: { pagination: { next_token: null } },
};

const AttachFilesSection = ({
  handleChange,
  handleAttachSelectedFiles,
  maxFiles = maxNumberOfFiles,
  t,
}: I18nProps<Props>) => {
  const data = useSelector(selectData);
  const validation = useSelector(selectValidation);

  const [documentFileTypesDropdownOpen, setDocumentFileTypesDropdownOpen] =
    useState<boolean>(false);
  const [documentCategoriesDropdownOpen, setDocumentCategoriesDropdownOpen] =
    useState<boolean>(false);

  const [documentDateRange, setDocumentDateRange] = useState<Array<?Moment>>([
    null,
    null,
  ]);
  const [filesDropdownOpen, setFilesDropdownOpen] = useState<boolean>(false);
  const [existingFiles, setExistingFiles] = useState<Array<Option>>([]);
  const [searchString, setSearchString] = useState<?string>(null);
  const [nextToken, setNextToken] = useState<?string>(null);

  const isSearchMode =
    !data.athlete &&
    !data.documentDateRange &&
    !data.documentCategories.length &&
    !data.documentFileTypes.length;

  const isFilesError = !!(
    validation.errors?.files?.length || validation.errors?.selectedFiles?.length
  );

  const firstDateRange = documentDateRange[0];
  const secondDateRange = documentDateRange[1];
  const validFirstDateRange = firstDateRange && firstDateRange.isValid();
  const validSecondDateRange = secondDateRange && secondDateRange.isValid();
  const isDocumentRangeError =
    (validFirstDateRange && !validSecondDateRange) ||
    (!validFirstDateRange && validSecondDateRange);

  const {
    data: documentCategories = initialDocumentCategoriesData,
    isFetching: areDocumentCategoriesFetching,
  } = useGetDocumentNoteCategoriesQuery(undefined, {
    skip: !documentCategoriesDropdownOpen,
  });

  const {
    data: documentFileTypes = initialDocumentFileTypesData,
    isFetching: areDocumentFileTypesFetching,
  } = useGetMedicalAttachmentsFileTypesQuery(undefined, {
    skip: !documentFileTypesDropdownOpen,
  });

  const {
    data: fetchedFiles = initialFilesData,
    isFetching: areFilesFetching,
  } = useSearchMedicalEntityAttachmentsQuery(
    {
      filters: {
        entity_athlete_id: data.athlete?.id,
        archived: false,
        filename: searchString,
        entity_date: data.documentDateRange,
        file_types: data.documentFileTypes.map(({ id }) => id),
        medical_attachment_category_ids: data.documentCategories.map(
          ({ id }) => id
        ),
      },
      nextPageToken: nextToken,
    },
    {
      skip:
        !filesDropdownOpen ||
        (isSearchMode &&
          (!searchString || searchString.length < minCharactersToSearch)) ||
        (existingFiles.length && !nextToken),
    }
  );

  /*
    When getting next items, the list scrolls to the top.
    The below fixes the scroll as per: https://github.com/mui/material-ui/issues/18450#issuecomment-1833700978
  */
  const persistedListBox = useRef();
  const persistedScrollTop = useRef();
  useEffect(() => {
    if (persistedListBox.current) {
      setTimeout(() => {
        persistedListBox.current.scrollTo({
          top: persistedScrollTop.current,
        });
        persistedListBox.current = null;
      }, 1);
    }
  }, [fetchedFiles]);

  useEffect(() => {
    const mappedFiles = mapFilesToOptions(fetchedFiles.entity_attachments);
    setExistingFiles((prevState) => {
      const allFiles = [...prevState, ...data.selectedFiles, ...mappedFiles];
      return uniqBy(allFiles, (v) => v.id);
    });
  }, [fetchedFiles]);

  const onSearch = (newInputValue) => {
    setExistingFiles([]);
    setNextToken(null);
    setDocumentDateRange([null, null]);
    setSearchString(newInputValue);
  };

  const onSearchDebounced = useDebouncedCallback(onSearch, 500);

  useEffect(() => {
    return () => {
      onSearchDebounced?.cancel?.();
    };
  }, [onSearchDebounced]);

  const clearExistingFiles = () => {
    setExistingFiles([]);
    setNextToken(null);
    setSearchString('');
  };

  return (
    <>
      <Typography
        color={isFilesError ? 'error' : 'primary'}
        variant="subtitle2"
        mt={2}
        mb={1}
        fontWeight={500}
      >
        {t('From documents')}
      </Typography>
      <Errors errors={validation.errors?.selectedFiles} wrapInHelperText />
      <AthleteSelector
        fullWidth
        disablePortal
        label={t('Athlete')}
        value={data.athlete}
        onChange={(value) => {
          setExistingFiles([]);
          setNextToken(null);
          setSearchString('');
          handleChange(SEND_DRAWER_DATA_KEY.athlete, value);
        }}
      />
      <Grid container spacing={2} my={1}>
        <Grid xs={12} md={5}>
          <DateRangePicker
            label={t('Date range')}
            value={documentDateRange}
            onChange={([firstDate, secondDate]) => {
              setDocumentDateRange([firstDate, secondDate]);
              if (!firstDate || !secondDate) {
                handleChange(SEND_DRAWER_DATA_KEY.documentDateRange, null);
                return;
              }
              clearExistingFiles();
              handleChange(SEND_DRAWER_DATA_KEY.documentDateRange, {
                start_date: moment(firstDate).format(dateTransferFormat),
                end_date: moment(secondDate).format(dateTransferFormat),
              });
            }}
            slots={{
              field: SingleInputDateRangeField,
              popper: (props) => (
                <Popper
                  {...props}
                  sx={{ ...props.sx, zIndex: zIndices.toastDialog }}
                />
              ),
            }}
            slotProps={{
              textField: {
                error: isFilesError || isDocumentRangeError,
                helperText: isDocumentRangeError
                  ? t(`{{dateField}} date is required`, {
                      dateField: !documentDateRange[0] ? 'Start' : 'End',
                    })
                  : null,
                clearable: true,
              },
            }}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <Autocomplete
            multiple
            fullWidth
            size="small"
            limitTags={1}
            disablePortal
            disableCloseOnSelect
            loading={areDocumentFileTypesFetching}
            onOpen={() => setDocumentFileTypesDropdownOpen(true)}
            onClose={() => setDocumentFileTypesDropdownOpen(false)}
            value={data.documentFileTypes}
            onChange={(e, value) => {
              clearExistingFiles();
              handleChange(SEND_DRAWER_DATA_KEY.documentFileTypes, value);
            }}
            options={
              !areDocumentFileTypesFetching
                ? documentFileTypes.map(({ value: id, label }) => ({
                    id,
                    label,
                  }))
                : []
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) =>
              renderInput({
                params,
                label: t('File types'),
                loading: areDocumentFileTypesFetching,
              })
            }
            renderOption={(props, option, { selected }) => {
              const iconWithColor = fileGroupToIcon(option.id);
              return (
                <li
                  {...props}
                  key={option.id}
                  css={{
                    '::before': {
                      content: iconWithColor.icon,
                      color: iconWithColor.color,
                      fontFamily: 'kitman',
                      display: 'inline',

                      width: '15px',
                    },
                  }}
                  style={{ fontSize: '14px', padding: '2px 10px' }}
                >
                  <Checkbox checked={selected} size="small" sx={{ p: 1 }} />
                  {option.label}
                </li>
              );
            }}
            getOptionLabel={(option) => option.label}
            noOptionsText={t('No file types')}
          />
        </Grid>
        <Grid xs={12} md={3}>
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
            onChange={(e, value) => {
              clearExistingFiles();
              handleChange(SEND_DRAWER_DATA_KEY.documentCategories, value);
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
              })
            }
            renderOption={renderCheckboxes}
            noOptionsText={t('No categories')}
          />
        </Grid>
      </Grid>
      <Autocomplete
        multiple
        size="small"
        disablePortal
        disableCloseOnSelect
        freeSolo={isSearchMode}
        loading={areFilesFetching}
        onOpen={() => setFilesDropdownOpen(true)}
        onClose={() => setFilesDropdownOpen(false)}
        value={data.selectedFiles}
        onChange={(e, value) => {
          handleChange(
            SEND_DRAWER_DATA_KEY.selectedFiles,
            value.filter((option) => typeof option !== 'string')
          );
        }}
        onInputChange={(event, newInputValue) => {
          if (!isSearchMode || !newInputValue) {
            return;
          }
          onSearchDebounced(newInputValue);
        }}
        filterOptions={isSearchMode ? (x) => x : undefined}
        options={
          !areFilesFetching || nextToken
            ? // filter out files with size exceeding maxFileSizeInBytes
              existingFiles.filter(
                (option: Option) =>
                  option.file &&
                  option.file?.filesize <= maxFileSizeInBytes &&
                  !data.attachedFiles.map((file) => file.id).includes(option.id)
              )
            : []
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) =>
          renderInput({
            params,
            label: isSearchMode ? t('Search files') : t('Files'),
            loading: areFilesFetching,
          })
        }
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.id}>
            <IconButton sx={{ mr: 1 }} size="small">
              <KitmanIcon
                name={selected ? KITMAN_ICON_NAMES.Done : KITMAN_ICON_NAMES.Add}
                fontSize="small"
              />
            </IconButton>
            {`${option.label} - ${fileSizeLabel(option.file?.filesize, true)}`}
          </li>
        )}
        getOptionLabel={(option) => option.label}
        noOptionsText={t('No files')}
        // MUI Autocomplete pagination: https://github.com/mui/material-ui/issues/18450
        ListboxProps={{
          onScroll: (event) => {
            const listboxNode = event.currentTarget;
            if (
              listboxNode.scrollTop + listboxNode.clientHeight ===
              listboxNode.scrollHeight
            ) {
              persistedListBox.current = listboxNode;
              persistedScrollTop.current = listboxNode.scrollTop;
              setNextToken(fetchedFiles.meta.pagination.next_token);
            }
          },
        }}
      />
      <Box textAlign="right" mt={1}>
        <Button
          size="small"
          onClick={() => handleAttachSelectedFiles()}
          disabled={
            !data.selectedFiles.length || data.selectedFiles.length > maxFiles
          }
        >
          {t('Attach')}
        </Button>
      </Box>
    </>
  );
};

export const AttachFilesSectionTranslated: ComponentType<Props> =
  withNamespaces()(AttachFilesSection);
export default AttachFilesSection;
