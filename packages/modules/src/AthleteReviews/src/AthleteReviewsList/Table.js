// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import {
  Box,
  Chip,
  DataGrid as MuiDataGrid,
  GridActionsCellItem,
} from '@kitman/playbook/components';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { useGetStaffUsersQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { AppStatus } from '@kitman/components';

import { useDispatch } from 'react-redux';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { useEditReviewMutation } from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
import type { Review } from '../shared/services/searchReviewList';
import { AthleteReviewDeleteModalTranslated as AthleteReviewDeleteModal } from '../shared/components/AthleteReviewDeleteModal';
import { statusEnumLike, getStatusLabelsEnumLike } from '../shared/enum-likes';
import { renderReviewListRows } from './helper';
import {
  getStatusMenuOptions,
  dispatchToastMessage,
  getDefaultReviewForm,
} from '../shared/utils';
import type { StatusLabelsEnumLikeKeys, ReviewFormData } from '../shared/types';

type Props = {
  athleteId: number,
  reviewList: Array<Review>,
  getNextReviews: () => void,
  isReviewListFetching: boolean,
};

const defaultDeleteModal = { isOpen: false, form: getDefaultReviewForm() };

const Table = ({
  athleteId,
  reviewList,
  getNextReviews,
  isReviewListFetching,
  t,
}: I18nProps<Props>) => {
  const commonColumnFields = {
    flex: 1,
    sortable: false,
    minWidth: 150,
  };
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean,
    form: ReviewFormData,
  }>(defaultDeleteModal);
  const locationAssign = useLocationAssign();
  const dispatch = useDispatch();
  const {
    data: staffUsers = [],
    error: staffUsersError,
    isLoading: areStaffUsersLoading,
  } = useGetStaffUsersQuery();

  const [editReview, { isLoading: isReviewEditSaving }] =
    useEditReviewMutation();

  const isLoading =
    isReviewListFetching || isReviewEditSaving || areStaffUsersLoading;

  const updateReviewStatus = (
    newReviewStatus: StatusLabelsEnumLikeKeys,
    form?: ReviewFormData
  ) => {
    const translatedStatusLabels = getStatusLabelsEnumLike(t);
    if (form) {
      editReview({
        athleteId,
        reviewId: form.id,
        form: { ...form, review_status: newReviewStatus },
      }).then(({ error }) => {
        if (error) {
          dispatchToastMessage({
            dispatch,
            message: t('Error editing review status'),
            status: toastStatusEnumLike.Error,
          });
        } else {
          // TODO in future iteration update state locally rather than invalidating tags
          dispatchToastMessage({
            dispatch,
            message: t('Review marked as {{statusLabel}}', {
              statusLabel:
                translatedStatusLabels[newReviewStatus].toLocaleLowerCase(),
            }),
            status: toastStatusEnumLike.Success,
          });
        }
      });
    }
  };

  if (staffUsersError) {
    return <AppStatus status="error" />;
  }

  return (
    <Box sx={{ width: '100%', height: 600 }}>
      <MuiDataGrid
        onRowClick={(review) =>
          locationAssign(`/athletes/${athleteId}/athlete_reviews/${review.id}`)
        }
        infiniteLoading
        infiniteLoadingCall={() => getNextReviews()}
        rowCount={reviewList.length}
        columns={[
          {
            field: 'start_date',
            headerName: t('Start Date'),
          },
          {
            field: 'due_date',
            headerName: t('Due Date'),
          },
          {
            field: 'review_type',
            headerName: t('Review Type'),
          },
          {
            field: 'description',
            headerName: t('Description'),
          },
          {
            field: 'staff',
            headerName: t('Staff'),
          },
          {
            field: 'squad',
            headerName: t('Squad'),
          },
          {
            field: 'status',
            headerName: t('Status'),
            renderCell: ({ value: reviewStatus }) => {
              const translatedStatusLabels = getStatusLabelsEnumLike(t);
              const label = translatedStatusLabels[reviewStatus];
              let color;
              switch (reviewStatus) {
                case statusEnumLike.completed: {
                  color = 'success';
                  break;
                }
                case statusEnumLike.upcoming: {
                  color = 'primary';
                  break;
                }
                case statusEnumLike.deleted:
                case statusEnumLike.inProgress:
                default: {
                  color = 'default';
                  break;
                }
              }
              return <Chip color={color} label={label} />;
            },
          },
          {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: ({ row }) =>
              getStatusMenuOptions({
                currentStatus: row.status,
                updateReviewStatus,
                t,
              }).map(({ id: key, newStatus, title: label }) => (
                <GridActionsCellItem
                  label={label}
                  onClick={() =>
                    newStatus === statusEnumLike.deleted
                      ? setDeleteModal({ isOpen: true, form: row })
                      : updateReviewStatus(newStatus, row)
                  }
                  showInMenu
                  key={key}
                />
              )),
          },
        ].map((column) => {
          // to get around sonar-cloud duplication when adding commonColumnFields to ever field bar actions (will be updated future)
          if (column.field === 'actions') {
            return { ...column };
          }

          return { ...column, ...commonColumnFields };
        })}
        rows={renderReviewListRows({ reviewList, staffUsers })}
        loading={isLoading}
      />
      <AthleteReviewDeleteModal
        isOpen={deleteModal.isOpen}
        deleteTitle={t('Delete review')}
        deleteDescription={t('Are you sure you want to delete this review?')}
        onDelete={() =>
          updateReviewStatus(statusEnumLike.deleted, deleteModal?.form)
        }
        closeModal={() => setDeleteModal(defaultDeleteModal)}
      />
    </Box>
  );
};

export const TableTranslated: ComponentType<Props> = withNamespaces()(Table);
export default Table;
