/* eslint-disable camelcase */
// @flow
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import i18n from '@kitman/common/src/utils/i18n';
import {
  Box,
  Button,
  ConfirmationModal,
  Stack,
} from '@kitman/playbook/components';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import type { Filters as SearchHomegrownListFilters } from '@kitman/modules/src/LeagueOperations/shared/services/searchUserList';

import { DEFAULT_PAGE_SIZE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import type { Homegrown } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { HomegrownRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import {
  useSearchHomegrownListQuery,
  useArchiveHomegrownSubmissionMutation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';

import withGridDataManagement from '@kitman/modules/src/LeagueOperations/shared/components/withGridDataManagement';
import type { HomegrownTabProps } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import type { HomegrownPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import {
  onToggleHomegrownPanel,
  onHomegrownSubmissionChange,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/homegrownSlice';

import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';
import { GridSearchTranslated as GridSearch } from '@kitman/modules/src/LeagueOperations/shared/components/GridSearch';
import GridFilterSearch from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFilterSearch';
import onTransformData from './utils';

type Props = {
  ...SearchHomegrownListFilters,
  permissions: HomegrownPermissions,
};

const TabHomegrownList = ({
  gridQueryParams,
  filterOverrides,
  permissions,
  enableFiltersPersistence,
  gridName,
}: HomegrownTabProps<Props>) => {
  const canManageHomegrown = Boolean(permissions?.canManageHomegrown);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [submissionIdToBeDelete, setSubmissionIdToBeDeleted] = useState<
    number | null
  >(null);
  const initialFilters: SearchHomegrownListFilters = {
    search_expression: '',
    per_page: DEFAULT_PAGE_SIZE,
    page: 1,
  };
  const dispatch = useDispatch();

  const [archiveHomegrownSubmission] = useArchiveHomegrownSubmissionMutation();

  const onOpenHomegrownPanel = () => {
    dispatch(onToggleHomegrownPanel({ isOpen: true }));
  };

  const onEditHomegrownSubmission = (rowData: HomegrownRow) => {
    const {
      id,
      title,
      certified_by,
      date_submitted,
      submitted_by,
      documents = [],
    } = rowData;

    // Safeguard. If both documents are not present do not allow edit.
    if (!documents.length) {
      return;
    }

    // Helper function to create document object
    const createDocumentObject = (document) => {
      // guard against null/undefined attachment
      if (!document?.attachment) {
        return null;
      }

      return {
        file: {
          filename: document.attachment.filename,
          fileType: document.attachment.filetype,
          fileSize: document.attachment.filesize,
          id: document.attachment.id,
        },
        state: 'SUCCESS',
        message: `${fileSizeLabel(
          document.attachment.filesize,
          true
        )} • ${i18n.t('Complete')}`,
      };
    };

    // Find specific documents
    const homegrownDocument = documents.find(
      (doc) => doc.title === 'Homegrown.pdf'
    );
    const certifiedDocument = documents.find(
      (doc) => doc.title === 'Approval.pdf'
    );

    // Create objects for homegrown_document and certified_document
    const homegrown_document = homegrownDocument
      ? createDocumentObject(homegrownDocument)
      : null;
    const certified_document = certifiedDocument
      ? createDocumentObject(certifiedDocument)
      : null;

    dispatch(
      onHomegrownSubmissionChange({
        id,
        title,
        certified_by,
        date_submitted,
        submitted_by,
        homegrown_document,
        certified_document,
      })
    );
    onOpenHomegrownPanel();
  };

  const useResponsiveFilters = window.getFlag('lops-grid-filter-enhancements');

  const renderFilters = ({
    onUpdate,
    filters,
    requestStatus,
  }: {
    onUpdate: (args: { search_expression: string, page: number }) => void,
    filters: SearchHomegrownListFilters,
    requestStatus: RequestStatus,
  }) => {
    const isRequestPending =
      requestStatus.isFetching ||
      requestStatus.isLoading ||
      requestStatus.isError;
    return (
      <Stack
        direction="row"
        gap={2}
        justifyContent="space-between"
        alignItems="flex-end"
        width="100%"
      >
        <Box sx={{ marginLeft: '-8px' }}>
          {useResponsiveFilters ? (
            <GridFilterSearch
              label={i18n.t('Search')}
              param="search_expression"
              onChange={(value) => {
                onUpdate({
                  search_expression: value,
                  page: 1,
                });
              }}
              value={filters.search_expression || ''}
              showSearchIcon
              disabled={isRequestPending}
            />
          ) : (
            <GridSearch
              value={filters.search_expression}
              onUpdate={(value) =>
                onUpdate({
                  search_expression: value,
                  page: 1,
                })
              }
              requestStatus={requestStatus}
            />
          )}
        </Box>
        {canManageHomegrown && (
          <Button
            sx={{ height: 'fit-content', margin: 1 }}
            onClick={onOpenHomegrownPanel}
          >
            {i18n.t('Add')}
          </Button>
        )}
      </Stack>
    );
  };

  const onBuildActions = ({ row }): Array<GridActionsCellItem> => {
    const items = [
      {
        isVisible: canManageHomegrown,
        element: (
          <GridActionsCellItem
            label={i18n.t('Edit')}
            showInMenu
            onClick={() => {
              onEditHomegrownSubmission(row);
            }}
          />
        ),
      },
      {
        isVisible: canManageHomegrown,
        element: (
          <GridActionsCellItem
            label={i18n.t('Delete')}
            showInMenu
            onClick={() => {
              setSubmissionIdToBeDeleted(row.id);
              setIsConfirmationModalOpen(true);
            }}
          />
        ),
      },
    ];
    return items.filter((i) => i.isVisible).map((i) => i.element);
  };

  const onCloseConfirmationModal = () => {
    setSubmissionIdToBeDeleted(null);
    setIsConfirmationModalOpen(false);
  };

  return (
    <>
      {withGridDataManagement<
        Homegrown,
        HomegrownRow,
        SearchHomegrownListFilters
      >({
        useSearchQuery: useSearchHomegrownListQuery,
        initialFilters,
        title: i18n.t('Homegrown'),
        onTransformData,
        slots: {
          filters: renderFilters,
          onGetActions: (params) => onBuildActions({ row: params.row }),
        },
        enableFiltersPersistence,
        gridName,
      })({
        filterOverrides: filterOverrides ?? {},
        gridQueryParams,
      })}
      <ConfirmationModal
        isModalOpen={isConfirmationModalOpen}
        isLoading={false}
        onConfirm={() => {
          archiveHomegrownSubmission(submissionIdToBeDelete);
          onCloseConfirmationModal();
        }}
        onCancel={() => onCloseConfirmationModal()}
        onClose={() => onCloseConfirmationModal()}
        dialogContent={i18n.t(
          'Are you sure you want to delete this submission?'
        )}
        translatedText={{
          title: i18n.t('Delete submission'),
          actions: {
            ctaButton: i18n.t('Confirm'),
            cancelButton: i18n.t('Cancel'),
          },
        }}
      />
    </>
  );
};

export default TabHomegrownList;
