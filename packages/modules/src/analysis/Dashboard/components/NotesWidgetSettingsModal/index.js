// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';

import { trackIntercomEvent } from '@kitman/common/src/utils';
import {
  LegacyModal as Modal,
  MultiSelectDropdown,
  TextButton,
} from '@kitman/components';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import TimePeriod from '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/TimePeriod';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

import AthleteSelector from '../../containers/AthleteSelector';

type Props = {
  annotationTypes: Array<Object>,
  isOpen: boolean,
  onClickCloseModal: Function,
  onClickSaveNotesWidgetSettings: Function,
  onSetNotesWidgetSettingsPopulation: Function,
  onSetNotesWidgetSettingsTimePeriod: Function,
  onSelectAnnotationType: Function,
  onUnselectAnnotationType: Function,
  onUpdateNotesWidgetSettingsDateRange: Function,
  onUpdateNotesWidgetSettingsTimePeriodLength: Function,
  selectedAnnotationTypes: Array<Object>,
  selectedDateRange: Object,
  selectedPopulation: SquadAthletesSelection,
  selectedTimePeriod: string,
  selectedTimePeriodLength: number,
  turnaroundList: Array<Turnaround>,
  widgetId: number,
};

function NotesWidgetSettingsModal(props: I18nProps<Props>) {
  const [lastXTimePeriod, setLastXTimePeriod] = useState('days');
  const [isInvalid, setIsInvalid] = useState(false);
  const { trackEvent } = useEventTracking();

  const onSave = () => {
    trackIntercomEvent('note-widget-modal-save');
    // Mixpanel
    trackEvent(reportingEventNames.addNotes);
    if (props.selectedAnnotationTypes.length < 1) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      props.onClickSaveNotesWidgetSettings(props.widgetId);
    }
  };

  return (
    <Modal
      title={props.t('Notes Widget Settings')}
      isOpen={props.isOpen}
      close={() => props.onClickCloseModal()}
      style={{ overflow: 'visible', height: '490px' }}
      width={690}
    >
      <div className="notesWidgetSettingsModal">
        <div className="notesWidgetSettingsModal__form">
          <MultiSelectDropdown
            invalid={isInvalid}
            label={props.t('Note Type')}
            listItems={props.annotationTypes}
            onItemSelect={(item) => {
              if (item.checked) {
                props.onSelectAnnotationType(parseInt(item.id, 10));
              } else {
                props.onUnselectAnnotationType(parseInt(item.id, 10));
              }
            }}
            selectedItems={props.selectedAnnotationTypes.map((selectedItem) => {
              return selectedItem.organisation_annotation_type_id.toString();
            })}
          />
          <AthleteSelector
            data-testid="NotesWidgetSettingsModal|AthleteSelector"
            showDropdownButton
            selectedSquadAthletes={props.selectedPopulation}
            label={props.t('#sport_specific__Athletes')}
            onSelectSquadAthletes={(squadAthletesSelection) => {
              props.onSetNotesWidgetSettingsPopulation(squadAthletesSelection);
            }}
          />
          <div className="notesWidgetSettingsModal__timePeriod">
            <TimePeriod
              turnaroundList={props.turnaroundList}
              updateTimePeriod={(timePeriod) => {
                props.onSetNotesWidgetSettingsTimePeriod(timePeriod);
              }}
              updateDateRange={(dateRange) =>
                props.onUpdateNotesWidgetSettingsDateRange(dateRange)
              }
              onUpdateTimePeriodLength={(timePeriodLength) => {
                props.onUpdateNotesWidgetSettingsTimePeriodLength(
                  timePeriodLength
                );
              }}
              onUpdateLastXTimePeriod={(xTimePeriod) => {
                setLastXTimePeriod(xTimePeriod);
              }}
              timePeriod={props.selectedTimePeriod}
              timePeriodLength={props.selectedTimePeriodLength}
              lastXTimePeriod={lastXTimePeriod}
              dateRange={props.selectedDateRange}
              t={props.t}
            />
          </div>
        </div>
        <div className="notesWidgetSettingsModal__footer">
          <TextButton text={props.t('Save')} type="primary" onClick={onSave} />
        </div>
      </div>
    </Modal>
  );
}

NotesWidgetSettingsModal.defaultProps = {
  annotationTypes: [],
  selectedAnnotationTypes: [],
};

export default NotesWidgetSettingsModal;
export const NotesWidgetSettingsModalTranslated = withNamespaces()(
  NotesWidgetSettingsModal
);
