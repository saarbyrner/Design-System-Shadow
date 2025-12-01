// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Select } from '@kitman/components';
import type { MatchDayEmailPanelMode } from '@kitman/modules/src/PlanningEvent/src/redux/slices/matchDayEmailSlice';
import getEmailRecipients from '@kitman/services/src/services/notifications/getEmailRecipients';
import getParticipants from '@kitman/services/src/services/notifications/getParticipants';
import { mailingList } from '@kitman/modules/src/Contacts/shared/constants';

type SelectedItems = Array<string> | string;

type Props = {
  eventId: number,
  selectedRecipients: Array<string>,
  mode: MatchDayEmailPanelMode,
  onChange: (SelectedItems) => void,
  isTeamNotificationsFlow: boolean,
};

const MatchDayEmailRecipientsDropdown = (props: I18nProps<Props>) => {
  const {
    t,
    eventId,
    selectedRecipients,
    mode,
    onChange,
    isTeamNotificationsFlow,
  } = props;
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const includeDmr = mode === mailingList.Dmr.toUpperCase();
    const includeDmn = mode === mailingList.Dmn.toUpperCase();

    const getRecipients =
      !isTeamNotificationsFlow && includeDmr
        ? () =>
            getParticipants({
              eventId,
              recipientsType: 'event_participants_contacts',
            })
        : () => getEmailRecipients({ eventId, includeDmr, includeDmn });

    const loadRecipients = async () => {
      try {
        const data = await getRecipients();

        const formattedOptions = (data || []).map(({ email }) => ({
          label: email,
          value: email,
        }));

        setOptions(formattedOptions);
        onChange(formattedOptions.map(({ value }) => value));
      } catch {
        onChange([]);
      }
    };
    loadRecipients();
  }, []);

  return (
    <Select
      options={options}
      label={t('Mailing List')}
      placeholder={props.t('{{mode}} Contacts ({{count}} recipients)', {
        mode,
        count: selectedRecipients.length,
      })}
      valueContainerContent={props.t(
        '{{mode}} Contacts ({{count}} {{recipientText}})',
        {
          mode,
          count: selectedRecipients.length,
          recipientText:
            selectedRecipients.length === 1 ? 'recipient' : 'recipients',
        }
      )}
      value={selectedRecipients}
      isMulti
      onChange={(value) => onChange(value)}
    />
  );
};

export default MatchDayEmailRecipientsDropdown;
export const MatchDayEmailRecipientsDropdownTranslated = withNamespaces()(
  MatchDayEmailRecipientsDropdown
);
