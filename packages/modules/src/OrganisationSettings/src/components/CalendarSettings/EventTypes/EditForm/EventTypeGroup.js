// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { InputText, Checkbox } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { type Option } from '@kitman/components/src/Select';
import { Tooltip } from '@kitman/playbook/components';
import { Box } from '@mui/material';
import { SquadSelectTranslated as SquadSelect } from './SquadSelect';
import styles, { getRowStyles } from './utils/styles';
import { EventTypeListTranslated as EventTypeList } from './EventTypeList';
import type {
  GroupedEventTypes,
  UngroupedEventTypes,
  NewGroup,
} from '../utils/types';
import type {
  OnRemovingNewEventFromGroup,
  OnAddingEventToGroup,
  OnChangingName,
  OnChangingColor,
  BoundDuplicateNameCustomValidation,
  OnChangingSquads,
} from './utils/types';

type Props = {
  group: GroupedEventTypes | UngroupedEventTypes | NewGroup,
  onAddingEventToGroup: OnAddingEventToGroup,
  onChangingName: OnChangingName,
  onChangingColor: OnChangingColor,
  onSharedChange: (value: boolean) => void,
  onRemovingNewEventFromGroup: OnRemovingNewEventFromGroup,
  isGroupWithNewItem: boolean,
  duplicateNameCustomValidation: BoundDuplicateNameCustomValidation,
  canCreateCustomEvents: boolean,
  allSquadsOptions: Array<Option>,
  onChangingSquads: OnChangingSquads,
};

const EventTypeGroup = ({
  t,
  group: { name: groupName, children, id: groupId, squads, shared = false },
  onAddingEventToGroup,
  onRemovingNewEventFromGroup,
  onChangingName,
  onChangingColor,
  onSharedChange,
  isGroupWithNewItem,
  duplicateNameCustomValidation,
  onChangingSquads,
  allSquadsOptions,
  canCreateCustomEvents,
}: I18nProps<Props>) => {
  const groupSquadIdsSet = new Set(squads);

  const renderSharedCheckbox = () => {
    const isFeatureEnabled = window.getFlag('shared-custom-events');

    if (!isFeatureEnabled) {
      return null;
    }

    return (
      <Tooltip
        title={t(
          'When enabled, all events in this group are treated as shared'
        )}
      >
        <Box sx={{ display: 'flex', alignItems: 'end', mb: '6px' }}>
          <Checkbox
            label={t('Shared')}
            data-testid={`share-event-${groupId}`}
            id={`share-event-${groupId}`}
            isChecked={shared}
            toggle={({ checked }) => onSharedChange(checked)}
            kitmanDesignSystem
          />
        </Box>
      </Tooltip>
    );
  };

  return (
    <div css={styles.group}>
      <div
        css={getRowStyles({
          isScopedSquadsCustomEventsFFOn:
            window.featureFlags['squad-scoped-custom-events'],
        })}
      >
        <InputText
          label={t('Group Name')}
          value={groupName}
          kitmanDesignSystem
          autoFocus={groupId === ''}
          onValidation={({ value: newName }) => {
            if (newName !== groupName) {
              onChangingName({ eventIndex: null, newName });
            }
          }}
          customValidations={[
            duplicateNameCustomValidation.bind(null, groupName),
          ]}
          required
        />
        {window.featureFlags['squad-scoped-custom-events'] && (
          <SquadSelect
            allSquadsOptions={allSquadsOptions}
            currentlySelectedSquadIds={squads}
            onChangingSquads={onChangingSquads}
            eventIndex={null}
            shouldShowLabel
          />
        )}
        {renderSharedCheckbox()}
      </div>
      <EventTypeList
        duplicateNameCustomValidation={duplicateNameCustomValidation}
        eventTypes={children}
        onRemovingNewEventFromGroup={onRemovingNewEventFromGroup}
        onAddingEventToGroup={
          canCreateCustomEvents ? onAddingEventToGroup : null
        }
        isGroupWithNewItem={isGroupWithNewItem}
        onChangingName={onChangingName}
        onChangingColor={onChangingColor}
        onChangingSquads={onChangingSquads}
        allSquadsOptions={allSquadsOptions.filter(({ value }) =>
          groupSquadIdsSet.has(value)
        )}
      />
    </div>
  );
};

export const EventTypeGroupTranslated: ComponentType<Props> =
  withNamespaces()(EventTypeGroup);
export default EventTypeGroup;
