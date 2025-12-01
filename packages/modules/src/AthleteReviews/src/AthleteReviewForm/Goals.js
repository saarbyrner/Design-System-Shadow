// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Box, Button, Stack } from '@kitman/playbook/components';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { useSelector } from 'react-redux';
import type {
  ReviewFormData,
  Link,
  FormModeEnumLikeValues,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';
import { GoalFormTranslated as GoalForm } from './GoalForm';

type Props = {
  form: ReviewFormData,
  formMode: ?FormModeEnumLikeValues,
  isValidationTriggered: boolean,
  onAddGoal: () => void,
  onAddUrl: (developmentGoalIndex: number) => void,
  onRemoveGoal: (goalRemovalIndex: number) => void,
  onUpdateGoal: (
    goalId: number,
    key: string,
    value: string | Array<Link>
  ) => void,
};

const DEFAULT_GOAL_LIMIT = 30;

const Goals = ({
  form,
  formMode,
  isValidationTriggered,
  onAddGoal,
  onAddUrl,
  onRemoveGoal,
  onUpdateGoal,
  t,
}: I18nProps<Props>) => {
  const currentActiveSquad = useSelector(getActiveSquad());
  return (
    <Stack spacing={2} mt={1} mb={3}>
      {form.development_goals.map((goal, index) => (
        <GoalForm
          goal={goal}
          formMode={formMode}
          index={index}
          isValidationTriggered={isValidationTriggered}
          key={goal.id || index}
          squadId={form.squad_id || currentActiveSquad?.id}
          onAddUrl={onAddUrl}
          onRemoveGoal={onRemoveGoal}
          onUpdateGoal={onUpdateGoal}
        />
      ))}
      {form.development_goals.length < DEFAULT_GOAL_LIMIT && (
        <Box>
          <Button color="primary" onClick={onAddGoal}>
            {t('Add goal')}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export const GoalsTranslated: ComponentType<Props> = withNamespaces()(Goals);
export default Goals;
