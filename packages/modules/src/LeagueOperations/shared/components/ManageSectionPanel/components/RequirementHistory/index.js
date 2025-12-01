// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSelector } from 'react-redux';
import type {
  MultiRegistration,
  User,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { useFetchRequirementSectionHistoryQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';
import {
  getRequirementById,
  getPanelFormSectionId,
  getRegistrationProfile,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@kitman/playbook/components';
import { renderHistory } from '../../../RegistrationHistoryPanel';

const RequirementHistory = (props: I18nProps<{}>) => {
  const profile: User = useSelector(getRegistrationProfile);
  const sectionId: number = useSelector(getPanelFormSectionId);
  const currentRequirement: ?MultiRegistration = useSelector(
    getRequirementById()
  );

  const {
    data: requirementHistory,
    isLoading: isReguirementHistoryLoading,
    isError: isReguirementHistoryError,
  } = useFetchRequirementSectionHistoryQuery(
    {
      registration_id: currentRequirement?.id,
      user_id: profile.id,
      section_id: sectionId,
    },
    { skip: !currentRequirement }
  );

  const isDisabled =
    isReguirementHistoryLoading ||
    isReguirementHistoryError ||
    !requirementHistory?.status_history?.length > 0;

  return (
    <Accordion disabled={isDisabled}>
      <AccordionSummary
        expandIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ExpandMore} />}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 400 }}
        >
          {props.t('Show requirement history')}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ maxHeight: 500, overflowY: 'auto' }}>
        {requirementHistory?.status_history?.length > 0 &&
          renderHistory(requirementHistory.status_history)}
      </AccordionDetails>
    </Accordion>
  );
};

export default RequirementHistory;
export const RequirementHistoryTranslated =
  withNamespaces()(RequirementHistory);
