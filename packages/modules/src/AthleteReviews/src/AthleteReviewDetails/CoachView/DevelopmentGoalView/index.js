// @flow
import type { ComponentType } from 'react';
import structuredClone from 'core-js/stable/structured-clone';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Fragment, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Link,
  Button,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type {
  DevelopmentGoal,
  DevelopmentGoalComment,
  ReviewFormData,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';
import {
  goalStatusEnumLike,
  getGoalStatusLabelsEnumLike,
} from '@kitman/modules/src/AthleteReviews/src/shared/enum-likes';
import type { Dashboard } from '@kitman/services/src/services/getDashboards';
import {
  dispatchToastMessage,
  getDefaultDevelopmentGoalComment,
} from '@kitman/modules/src/AthleteReviews/src/shared/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { AthleteReviewDeleteModalTranslated as AthleteReviewDeleteModal } from '@kitman/modules/src/AthleteReviews/src/shared/components/AthleteReviewDeleteModal';
import { useDeleteReviewCommentMutation } from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import sharedStyles from '@kitman/modules/src/AthleteReviews/src/shared/style';
import ActionsMenu from '../../ActionsMenu';
import Comment from './Comment';

type Props = {
  reviewId: number,
  developmentGoalInfo: DevelopmentGoal,
  goalIndex: number,
  dashboards: Array<Dashboard>,
  onSave: ({
    goalIndex: number,
    newStatusValue: ?string,
    newComment: DevelopmentGoalComment,
  }) => Promise<void>,
  setForm: (
    newForm: ReviewFormData | ((prevForm: ReviewFormData) => ReviewFormData)
  ) => void,
};

const DEFAULT_GOAL_STATUS_VALUE = goalStatusEnumLike.inProgress;

const DevelopmentGoalView = ({
  reviewId,
  developmentGoalInfo: {
    additional_name: additionalName,
    principles,
    description,
    analytical_dashboard_ids: analyticalIds,
    attached_links: attachedLinks,
    status,
    athlete,
    comments,
  },
  goalIndex,
  dashboards,
  onSave,
  setForm,
  t,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const [newComment, setNewComment] = useState<DevelopmentGoalComment>(
    getDefaultDevelopmentGoalComment()
  );
  const [deleteComment, setDeleteComment] = useState<{
    isOpen: boolean,
    commentId: ?number,
  }>({
    isOpen: false,
    commentId: null,
  });
  const [isGoalInEditMode, setIsGoalInEditMode] = useState(false);
  const [statusValue, setStatusValue] = useState(
    status || DEFAULT_GOAL_STATUS_VALUE
  );
  const [prevStatusValue, setPrevStatusValue] = useState(
    status || DEFAULT_GOAL_STATUS_VALUE
  );

  const [deleteReviewComment] = useDeleteReviewCommentMutation();

  const translatedGoalStatusLabels = getGoalStatusLabelsEnumLike(t);

  const menuActions = [
    {
      id: 'add_comment_status',
      title: t('Add comment/status'),
      onClick: () => setIsGoalInEditMode(true),
    },
    { id: 'delete', title: t('Delete'), onClick: () => {} },
  ];

  const handleEditModeCancel = () => {
    setNewComment(getDefaultDevelopmentGoalComment());
    setIsGoalInEditMode(false);
    setStatusValue(prevStatusValue);
  };

  const handleOnEditSave = () => {
    const saveRequired =
      newComment.text.trim() || statusValue !== prevStatusValue;
    const newStatusValue = statusValue === prevStatusValue ? null : statusValue;

    // check save is required
    if (saveRequired) {
      onSave({
        goalIndex,
        newStatusValue,
        newComment,
      });
    }
    setNewComment(getDefaultDevelopmentGoalComment());
    setPrevStatusValue(statusValue);
    setIsGoalInEditMode(false);
  };

  const handleCommentDelete = () => {
    deleteReviewComment({
      reviewId,
      athleteId: athlete?.id,
      commentId: deleteComment.commentId,
    })
      .unwrap()
      .then(() => {
        dispatchToastMessage({
          dispatch,
          message: t('Comment deleted'),
          status: toastStatusEnumLike.Success,
        });
        setForm((prev) => {
          const currentDevelopmentGoals = structuredClone(
            prev.development_goals
          );
          currentDevelopmentGoals[goalIndex].comments = currentDevelopmentGoals[
            goalIndex
          ].comments.filter(
            (comment) => comment.id !== deleteComment.commentId
          );
          return { ...prev, development_goals: currentDevelopmentGoals };
        });
      })
      .catch(() => {
        dispatchToastMessage({
          dispatch,
          message: t('Error deleting comment'),
          status: toastStatusEnumLike.Error,
        });
      });
  };

  const getGoalStatusChipColor = (goalStatusValue: string) => {
    switch (goalStatusValue) {
      case goalStatusEnumLike.achieved:
        return 'success';
      case goalStatusEnumLike.notAchieved:
        return 'error';
      default:
        return 'default';
    }
  };

  const renderActionMenuArea = () => {
    if (isGoalInEditMode) {
      return (
        <>
          <Button
            color="secondary"
            sx={{ marginRight: '10px' }}
            onClick={handleEditModeCancel}
          >
            {t('Cancel')}
          </Button>
          <Button color="primary" onClick={handleOnEditSave}>
            {t('Save')}
          </Button>
        </>
      );
    }
    return <ActionsMenu items={menuActions} />;
  };

  const renderCommentStatusUpdateArea = () => {
    const statusTextValueArray = [
      goalStatusEnumLike.inProgress,
      goalStatusEnumLike.achieved,
      goalStatusEnumLike.notAchieved,
    ];

    return (
      <>
        <RadioGroup row value={statusValue} sx={{ marginLeft: '10px' }}>
          {statusTextValueArray.map((value) => (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio />}
              onClick={() => setStatusValue(value)}
              label={translatedGoalStatusLabels[value]}
            />
          ))}
        </RadioGroup>
        <TextField
          label={t('Comment')}
          value={newComment.text}
          onChange={(e) => {
            // TODO: remove e.persist() if React version is 17+.
            e.persist();
            setNewComment((prev) => ({
              ...prev,
              text: e.target?.value,
            }));
          }}
          multiline
          fullWidth
        />
      </>
    );
  };

  return (
    <>
      <Stack pl={4} pb={2} sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ position: 'absolute', left: 0 }}>
            {`${goalIndex + 1}.`}
          </Typography>
          <Typography variant="h6" pr={4}>
            {additionalName}
          </Typography>
          <Chip
            color={getGoalStatusChipColor(statusValue)}
            label={translatedGoalStatusLabels[statusValue]}
          />
          <Box sx={{ position: 'absolute', right: 0, top: -6 }}>
            {renderActionMenuArea()}
          </Box>
        </Box>
        {principles.length > 0 && (
          <Box mt={1}>
            {/* BE have made principles an array
                but user can only add one creating dev goal */}
            <Typography variant="body1">{principles[0].name}</Typography>
          </Box>
        )}
        <Box mt={1}>
          <Typography variant="body1">{description}</Typography>
        </Box>
        <Box mt={1} sx={{ display: 'inline-flex', alignItems: 'center' }}>
          {analyticalIds?.map((selectedDashboardId: number) => (
            <Link
              key={selectedDashboardId}
              href={`/analysis/dashboard/${selectedDashboardId}`}
              underline="hover"
              mr={2}
              sx={sharedStyles.linkStyle}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.Link} />
              {` ${
                dashboards.find(
                  ({ id: dashboardId }) => dashboardId === selectedDashboardId
                )?.name || ''
              }`}
            </Link>
          ))}
          {attachedLinks?.map(({ id: linkId, uri, title }) => (
            <Link
              key={linkId}
              href={uri}
              underline="hover"
              mr={2}
              sx={sharedStyles.linkStyle}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.Link} /> {title}
            </Link>
          ))}
        </Box>
        {comments.map((comment) => (
          <Fragment key={comment.id}>
            <Comment
              comment={comment}
              onDeleteComment={(commentId) =>
                setDeleteComment({ isOpen: true, commentId })
              }
            />
          </Fragment>
        ))}
        {isGoalInEditMode && (
          <Box mt={1}>{renderCommentStatusUpdateArea()}</Box>
        )}
      </Stack>
      <AthleteReviewDeleteModal
        isOpen={deleteComment.isOpen}
        deleteTitle={t('Delete comment')}
        deleteDescription={t('Are you sure you want to delete this comment?')}
        onDelete={handleCommentDelete}
        closeModal={() => setDeleteComment({ isOpen: false, commentId: null })}
      />
    </>
  );
};
export const DevelopmentGoalViewTranslated: ComponentType<Props> =
  withNamespaces()(DevelopmentGoalView);
export default DevelopmentGoalView;
