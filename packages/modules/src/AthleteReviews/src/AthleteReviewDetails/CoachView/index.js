// @flow
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import structuredClone from 'core-js/stable/structured-clone';
import { Divider, Stack, Typography } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type {
  ReviewFormData,
  DevelopmentGoalComment,
  DevelopmentGoal,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';
import {
  useEditReviewMutation,
  useGetDashboardsQuery,
  useUpdateDevelopmentGoalMutation,
} from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
import { AppStatus } from '@kitman/components';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { DevelopmentGoalViewTranslated as DevelopmentGoalView } from './DevelopmentGoalView';
import {
  dispatchToastMessage,
  getAthleteId,
  sanitizeDevelopmentGoals,
} from '../../shared/utils';

type Props = {
  form: ReviewFormData,
  setForm: (
    newForm: ReviewFormData | ((prevForm: ReviewFormData) => ReviewFormData)
  ) => void,
};

const CoachView = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const pathname = useLocationPathname();
  const currentAthleteId = getAthleteId(pathname);

  const { data: dashboards = [], error: dashboardsError } =
    useGetDashboardsQuery(
      { squadId: props.form.squad_id },
      { skip: !props.form.squad_id }
    );

  const [editReview] = useEditReviewMutation();
  const [updateDevelopmentGoal] = useUpdateDevelopmentGoalMutation();

  const handleEditDevelopmentGoal = async ({
    goalIndex,
    newStatusValue,
    newComment,
  }: {
    goalIndex: number,
    newStatusValue: ?string,
    newComment: DevelopmentGoalComment,
  }) => {
    const currentDevelopmentGoals = structuredClone(
      props.form.development_goals
    );

    // TODO: tech debt updateDevelopmentGoal/editReview to be merged into one call
    // https://kitmanlabs.atlassian.net/browse/CAD2-1188
    if (newComment.text.trim()) {
      await updateDevelopmentGoal({
        athleteId: currentAthleteId,
        reviewId: props.form.id,
        developmentGoal: {
          id: currentDevelopmentGoals[goalIndex].id,
          comments: [newComment],
        },
      })
        .unwrap()
        .then(({ comments }) => {
          props.setForm((prev) => {
            currentDevelopmentGoals[goalIndex].comments = comments;
            return { ...prev, development_goals: currentDevelopmentGoals };
          });
          dispatchToastMessage({
            dispatch,
            message: props.t('Comment added'),
            status: toastStatusEnumLike.Success,
          });
        })
        .catch(() => {
          dispatchToastMessage({
            dispatch,
            message: props.t('Error adding comment'),
            status: toastStatusEnumLike.Error,
          });
        });
    }
    if (newStatusValue) {
      currentDevelopmentGoals[goalIndex].status = newStatusValue;
      const sanitizedForm = sanitizeDevelopmentGoals({
        reviewForm: {
          ...props.form,
          development_goals: currentDevelopmentGoals,
        },
      });

      await editReview({
        athleteId: currentAthleteId,
        reviewId: props.form.id,
        form: sanitizedForm,
      })
        .unwrap()
        .then(() => {
          dispatchToastMessage({
            dispatch,
            message: props.t('Development goal updated'),
            status: toastStatusEnumLike.Success,
          });
        })
        .catch(() => {
          dispatchToastMessage({
            dispatch,
            message: props.t('Error updating goal'),
            status: toastStatusEnumLike.Error,
          });
        });
    }
  };

  const groupDevelopmentGoalsByGoalType = (
    devGoals: Array<DevelopmentGoal>
  ): { [devGoalTypeKey: string]: Array<DevelopmentGoal> } =>
    devGoals.reduce((acc, goal) => {
      // BE have made development_goal_types an array
      // but user can only add one creating dev goal
      const devGoalTypeKey = goal.development_goal_types[0]?.name;
      if (!acc[devGoalTypeKey]) {
        acc[devGoalTypeKey] = [goal];
      } else {
        acc[devGoalTypeKey].push(goal);
      }
      return acc;
    }, {});

  const renderDevelopmentGoals = (devGoals: Array<DevelopmentGoal>) => {
    const groupedByDevGoalType = groupDevelopmentGoalsByGoalType(devGoals);
    return Object.keys(groupedByDevGoalType).map((devGoalTypeKey: string) => (
      <Fragment key={devGoalTypeKey}>
        <Typography variant="h6">{devGoalTypeKey}</Typography>
        {groupedByDevGoalType[devGoalTypeKey].map(
          (devGoal: DevelopmentGoal, index: number) => (
            <Fragment key={devGoal.id}>
              <DevelopmentGoalView
                reviewId={+props.form.id}
                developmentGoalInfo={devGoal}
                dashboards={dashboards}
                goalIndex={index}
                setForm={props.setForm}
                onSave={handleEditDevelopmentGoal}
              />
            </Fragment>
          )
        )}
      </Fragment>
    ));
  };

  if (dashboardsError) {
    return <AppStatus status="error" />;
  }

  return (
    <Stack
      pb={4}
      spacing={1}
      divider={<Divider orientation="horizontal" flexItem />}
      data-testid="CoachView"
    >
      {renderDevelopmentGoals(props.form.development_goals)}
    </Stack>
  );
};
export const CoachViewTranslated: ComponentType<Props> =
  withNamespaces()(CoachView);
export default CoachView;
