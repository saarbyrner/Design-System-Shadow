// @flow
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Typography, Button } from '@kitman/playbook/components';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import { onTogglePanel } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { getDisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import type { DisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

const DisciplineHeader = (props: I18nProps<{}>) => {
  const dispatch = useDispatch();
  const disciplinePermissions: DisciplinePermissions = useSelector(
    getDisciplinePermissions()
  );

  const handleOnToggle = () => {
    dispatch(onTogglePanel({ isOpen: true }));
  };

  return (
    <HeaderLayout.Content>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {props.t('Discipline')}
      </Typography>

      {disciplinePermissions.canManageDiscipline && (
        <Button color="primary" onClick={handleOnToggle}>
          {props.t('Suspend')}
        </Button>
      )}
    </HeaderLayout.Content>
  );
};

export const DisciplineHeaderTranslated = withNamespaces()(DisciplineHeader);
export default DisciplineHeader;
