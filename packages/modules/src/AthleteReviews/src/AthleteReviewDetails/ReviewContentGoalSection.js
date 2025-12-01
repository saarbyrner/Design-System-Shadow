// @flow

import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
} from '@kitman/playbook/components';
import type {
  DevelopmentGoal,
  DevelopmentGoalComment,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';

type ReviewContentGoalSectionProps = {
  goals: Array<DevelopmentGoal>,
  goalStatusEnabled: boolean,
  getGoalStatusChipColor: (goalStatusValue: string) => string,
  getStatusLabel: (status: ?string) => string,
  coachingCommentsEnabled: boolean,
};

type GroupedGoals = { [string]: Array<DevelopmentGoal> };

const ReviewContentGoalSection = ({
  goals,
  goalStatusEnabled,
  getGoalStatusChipColor,
  getStatusLabel,
  coachingCommentsEnabled,
}: I18nProps<ReviewContentGoalSectionProps>) => {
  const groupedGoals: GroupedGoals = goals.reduce(
    (acc: GroupedGoals, goal: DevelopmentGoal) => {
      goal?.development_goal_types?.forEach((type) => {
        if (!acc[type.name]) {
          acc[type.name] = [];
        }
        acc[type.name].push(goal);
      });
      return acc;
    },
    {}
  );

  const sortedGoalTypes = Object.keys(groupedGoals).sort();
  const sortedGroupedGoals: GroupedGoals = sortedGoalTypes.reduce(
    (acc, type) => {
      acc[type] = groupedGoals[type].sort((a, b) =>
        (a.start_time || '').localeCompare(b.start_time || '')
      );
      return acc;
    },
    {}
  );
  const entries: Array<[string, Array<DevelopmentGoal>]> =
    // $FlowIgnore[incompatible-type] Flow cannot properly infer the type of Object.entries for the sortedGroupedGoals object, which has a mixed type for its values. Manual type assertion ensures that `entries` is treated as an array of tuples where each tuple contains a string key and an array of DevelopmentGoal
    Object.entries(sortedGroupedGoals);

  return (
    <Box>
      {entries.map(([goalType, goalsList]) => (
        <Box key={goalType} sx={{ borderBottom: '1px solid gray', mt: 4 }}>
          <Typography sx={{ mb: 2, mt: 4 }} variant="h6">
            {goalType}
          </Typography>

          {goalsList?.map((goal: DevelopmentGoal, goalIndex: number) => {
            const {
              id,
              description = '',
              status = '',
              additional_name: additionalName = '',
              comments = [],
            } = goal;

            const defaultStatus = String(status);

            return (
              <Box key={id} sx={{ mb: 4 }}>
                <Stack pl={4} sx={{ position: 'relative' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="h6"
                      sx={{ position: 'absolute', left: 0 }}
                    >
                      {`${goalIndex + 1}.`}
                    </Typography>
                    <Typography variant="h6" pr={4}>
                      {additionalName}
                    </Typography>
                    {goalStatusEnabled && (
                      <Chip
                        color={getGoalStatusChipColor(defaultStatus)}
                        label={getStatusLabel(defaultStatus)}
                      />
                    )}
                  </Box>
                  <Box mt={1}>
                    <Typography variant="body1">{description}</Typography>
                  </Box>
                </Stack>
                {comments.map((comment: DevelopmentGoalComment) => {
                  const {
                    id: commentId,
                    user: { fullname, avatar_url: commentAvatarUrl } = {},
                    created_at: createdAt = '',
                    text,
                  } = comment;

                  const formattedDate =
                    moment(createdAt).format('MMMM D, YYYY');

                  return (
                    coachingCommentsEnabled && (
                      <Box
                        key={commentId}
                        pl={4}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          borderLeft: '2px solid grey',
                          paddingLeft: 2,
                        }}
                      >
                        <Avatar
                          src={commentAvatarUrl}
                          alt={fullname}
                          sx={{ width: 36, height: 36, mr: 2 }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {fullname}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {formattedDate}
                          </Typography>
                          <Typography variant="body1">{text}</Typography>
                        </Box>
                      </Box>
                    )
                  );
                })}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export const ReviewContentGoalSectionTranslated = withNamespaces()(
  ReviewContentGoalSection
);
export default ReviewContentGoalSectionTranslated;
