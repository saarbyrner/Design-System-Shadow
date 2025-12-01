// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { InputRadio, Checkbox } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Event } from '../types';

type Props = {
  event: Event,
  onRpeCollectionAthleteChange: Function,
  onRpeCollectionKioskChange: Function,
  onMassInputChange: Function,
};

const RPECollectionForm = (props: I18nProps<Props>) => {
  return (
    <div className="rpeCollectionForm">
      <div className="rpeCollectionForm__rpeCollectionSection">
        <h3 className="rpeCollectionForm__rpeCollectionSectionTitle">
          {props.t('How do you want to collect RPEs?')}
        </h3>
        <div className="rpeCollectionForm__checkbox">
          <Checkbox
            id="rpe_collection_athlete_app"
            label={props.t('Athlete App')}
            isChecked={props.event.rpe_collection_athlete}
            toggle={(checkbox) => {
              props.onRpeCollectionAthleteChange(checkbox.checked);
            }}
          />
        </div>
        <div className="rpeCollectionForm__checkbox">
          <Checkbox
            id="rpe_collection_kiosk_app"
            label={props.t('Kiosk App')}
            isChecked={props.event.rpe_collection_kiosk}
            toggle={(checkbox) => {
              props.onRpeCollectionKioskChange(checkbox.checked);
            }}
          />
        </div>
      </div>
      <div
        className={classNames('rpeCollectionForm__kioskSection', {
          'rpeCollectionForm__kioskSection--disabled':
            !props.event.rpe_collection_kiosk,
        })}
      >
        <h3 className="rpeCollectionForm__kioskSectionTitle">
          {props.t('Kiosk View')}
        </h3>

        <div className="rpeCollectionForm__kioskTypeChoice">
          <img src="/img/kiosk-img/kiosk_view.svg" alt="Kiosk View" />
          <InputRadio
            inputName="KioskView"
            index={0}
            option={{ value: false, name: 'Kiosk View' }}
            change={() => props.onMassInputChange(false)}
            value={props.event.mass_input}
            disabled={!props.event.rpe_collection_kiosk}
          />
        </div>

        <div className="rpeCollectionForm__kioskTypeChoice">
          <img src="/img/kiosk-img/list_view.svg" alt="List View" />
          <InputRadio
            inputName="ListView"
            index={1}
            option={{ value: true, name: 'List View' }}
            change={() => props.onMassInputChange(true)}
            value={props.event.mass_input}
            disabled={!props.event.rpe_collection_kiosk}
          />
        </div>
      </div>
    </div>
  );
};

export default RPECollectionForm;
export const RPECollectionFormTranslated = withNamespaces()(RPECollectionForm);
