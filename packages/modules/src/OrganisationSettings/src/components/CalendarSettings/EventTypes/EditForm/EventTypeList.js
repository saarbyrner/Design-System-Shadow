// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  IconButton,
  InputText,
  TextButton,
  ColorPicker,
  Checkbox,
} from '@kitman/components';
import commonStyles from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/styles';
import type { CustomEventTypeIP } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { type Option } from '@kitman/components/src/Select';
import { fetchGraphColours } from '@kitman/modules/src/OrganisationSettings/src/actions';

import { Box } from '@mui/material';
import { NEW_EVENT_ID_PREFIX } from '../../utils/consts';
import type { NewCustomEvent } from '../utils/types';
import styles, { getRowStyles } from './utils/styles';
import type {
  OnRemovingNewEventFromGroup,
  OnAddingEventToGroup,
  OnChangingName,
  OnChangingSquads,
  OnChangingColor,
  BoundDuplicateNameCustomValidation,
} from './utils/types';
import { SquadSelectTranslated as SquadSelect } from './SquadSelect';
import ColorPickerModal from './ColorPickerModal';
import { Indexes } from '../types';

type Props = {
  eventTypes:
    | Array<$Exact<CustomEventTypeIP | NewCustomEvent>>
    | Array<NewCustomEvent>
    | Array<CustomEventTypeIP>,
  onRemovingNewEventFromGroup: OnRemovingNewEventFromGroup,
  onChangingName: OnChangingName,
  onChangingColor?: OnChangingColor,
  onAddingEventToGroup?: OnAddingEventToGroup | null,
  isGroupWithNewItem: boolean,
  duplicateNameCustomValidation: BoundDuplicateNameCustomValidation,
  onChangingSquads: OnChangingSquads,
  allSquadsOptions: Array<Option>,
  onSharedChange?: (index: number, value: boolean) => void,
};

const EventTypeList = ({
  // $FlowIgnore[incompatible-use] eventTypes’ type is fine.
  eventTypes,
  onRemovingNewEventFromGroup,
  onAddingEventToGroup,
  onChangingName,
  onChangingColor = () => {},
  isGroupWithNewItem,
  duplicateNameCustomValidation,
  allSquadsOptions,
  onChangingSquads,
  onSharedChange,
  t,
}: I18nProps<Props>) => {
  const [colorPickerModalEventIndex, setColorPickerModalEventIndex] = useState(
    Indexes.NoEvent
  );
  const [currentColor, setCurrentColor] = useState<string>('');

  const brandingColors = useSelector(
    ({ orgSettings }) => orgSettings.graphColourPalette
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGraphColours());
  }, []);

  return (
    <>
      <div css={commonStyles.tableContentContainer}>
        {eventTypes.length > 0 && (
          <div css={getRowStyles({ isWithColorPicker: true })}>
            <label css={styles.eventsTypeLabel}>{t('Events Type')}</label>
            {window.featureFlags['squad-scoped-custom-events'] && (
              <label css={styles.eventsTypeLabel}>{t('Squad')}</label>
            )}
          </div>
        )}
        {eventTypes.map(({ name: childName, id, squads, colour, shared }, index) => {
          const isNewRow =
            typeof id === 'string' && id.includes(NEW_EVENT_ID_PREFIX);
          const rowStyles = getRowStyles({
            isNewRow,
            isWithColorPicker: true,
          });
          const color = colour ? `#${colour}` : '#B134C1';
          return (
            <div css={rowStyles} key={`child_${id}`}>
              <InputText
                value={childName}
                kitmanDesignSystem
                autoFocus={
                  index === eventTypes.length - 1 && isGroupWithNewItem
                }
                onValidation={({ value: newName }) => {
                  if (newName !== childName) {
                    onChangingName({ eventIndex: index, newName });
                  }
                }}
                customValidations={[
                  duplicateNameCustomValidation.bind(null, childName),
                ]}
                required
              />

              {window.featureFlags['squad-scoped-custom-events'] && (
                <SquadSelect
                  allSquadsOptions={allSquadsOptions}
                  currentlySelectedSquadIds={squads}
                  onChangingSquads={onChangingSquads}
                  eventIndex={index}
                  shouldShowLabel={false}
                />
              )}
              <ColorPicker
                initialColor={color}
                onClick={() => {
                  setColorPickerModalEventIndex(index);
                  setCurrentColor(color);
                }}
                kitmanDesignSystem
                isExampleTextVisible
              />
              {onSharedChange && (
                <Box sx={{ display: 'flex', alignItems: 'end', mb: '6px' }}>
                  <Checkbox
                    label={t('Shared')}
                    data-testid={`share-event-${id}`}
                    id={`share-event-${id}`}
                    isChecked={shared}
                    toggle={({ checked }) => onSharedChange(index, checked)}
                    kitmanDesignSystem
                  />
                </Box>
              )}
              {isNewRow && (
                <IconButton
                  icon="icon-close"
                  isBorderless
                  isTransparent
                  onClick={() => onRemovingNewEventFromGroup(index)}
                />
              )}
            </div>
          );
        })}
        {onAddingEventToGroup ? (
          <div css={styles.addEventButtonContainer}>
            <TextButton
              onClick={onAddingEventToGroup}
              text={t('Add event to group')}
              kitmanDesignSystem
              size="large"
              type="subtle"
            />
          </div>
        ) : null}
      </div>
      <ColorPickerModal
        colorPickerModalEventIndex={colorPickerModalEventIndex}
        setColorPickerModalEventIndex={setColorPickerModalEventIndex}
        color={currentColor || ''}
        onChangeColor={setCurrentColor}
        onSave={() => {
          onChangingColor({
            eventIndex: colorPickerModalEventIndex,
            // slice(1) is used to remove ‘#’ from the beginning of the string.
            newColor: currentColor.slice(1),
          });
        }}
        brandingColors={brandingColors}
      />
    </>
  );
};

export const EventTypeListTranslated: ComponentType<Props> =
  withNamespaces()(EventTypeList);
export default EventTypeList;
