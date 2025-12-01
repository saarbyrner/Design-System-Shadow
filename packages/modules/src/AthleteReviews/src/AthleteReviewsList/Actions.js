// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import { Button, Stack } from '@kitman/playbook/components';
import { Link } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';

type Props = { athleteId: number };

const Actions = ({ athleteId, t }: I18nProps<Props>) => {
  return (
    <Stack direction="row" spacing={1} justifyContent="flex-end">
      <Button
        size="large"
        color="secondary"
        component={Link}
        href={`/athletes/${athleteId}/athlete_reviews/new`}
        sx={{
          '&:hover': {
            backgroundColor: colors.neutral_200,
          },
          '&:visited': {
            color: colors.grey_200,
          },
        }}
      >
        {t('New review')}
      </Button>
    </Stack>
  );
};

export const ActionsTranslated: ComponentType<Props> =
  withNamespaces()(Actions);
export default Actions;
