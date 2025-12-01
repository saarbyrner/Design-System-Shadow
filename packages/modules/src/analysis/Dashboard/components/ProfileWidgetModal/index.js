// @flow
import { withNamespaces } from 'react-i18next';
import { trackIntercomEvent } from '@kitman/common/src/utils';
import _orderBy from 'lodash/orderBy';
import { useState } from 'react';
import {
  Dropdown,
  LegacyModal as Modal,
  TextButton,
  Checkbox,
  ColorPicker,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { graphSeriesColors } from '@kitman/modules/src/analysis/shared/resources/graph/BaseConfig';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

import {
  PREVIEW_FIELD_NUMBERS,
  backgroundColorDropdownItems,
  backgroundColorValueMap,
  getInitialBackgroundColorOptionValue,
  profileWidgetDropdownItems,
} from '../utils';
import ProfileWidget from '../ProfileWidget';
import type { BackgroundColourValue } from '../types';

type Athlete = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
  position: string,
  positionGroupId: number,
  positionId: number,
};

type Props = {
  athleteId: string,
  athletes: Array<Athlete>,
  canManageDashboard: boolean,
  open: boolean,
  previewData: Object,
  onClickCloseModal: Function,
  onClickSaveProfileWidget: Function,
  onSelectAthlete: Function,
  onSelectWidgetInfoItem: Function,
  onSetAvatarAvailability: Function,
  onSetAvatarSquadNumber: Function,
  onSetBackgroundColour: Function,
  backgroundColour: string,
  selectedInfoFields: Array<Object>,
  showAvailabilityIndicator: boolean,
  showSquadNumber: boolean,
  widgetId: number,
};

function ProfileWidgetModal(props: I18nProps<Props>) {
  const { trackEvent } = useEventTracking();
  const isDashboardUIUpgrade = window.getFlag('rep-dashboard-ui-upgrade');
  const classVersionSuffix = isDashboardUIUpgrade ? 'V2' : '';
  const classes = {
    preview: `profileWidgetModal__preview${classVersionSuffix}`,
    previewNumbers: `profileWidgetModal__previewNumbers${classVersionSuffix}`,
    smallNumberCircle: `profileWidgetModal__smallNumberCircle${classVersionSuffix}`,
  };
  const initialBackgroundValue: BackgroundColourValue =
    getInitialBackgroundColorOptionValue(props.backgroundColour);

  const [backgroundColourType, setBackgroundColourType] = useState(
    initialBackgroundValue
  );

  const onSetBackgroundColourProps = (type: string) => {
    props.onSetBackgroundColour(backgroundColorValueMap[type]);
  };

  const onSave = () => {
    trackIntercomEvent('profile-widget-modal-save');
    // Mixpanel
    trackEvent(reportingEventNames.addProfile);
    props.onClickSaveProfileWidget(props.widgetId);
  };

  const modalHeight = isDashboardUIUpgrade ? '740px' : '670px';

  return (
    <Modal
      title={props.t('#sport_specific__Athlete_Profile')}
      isOpen={props.open}
      close={() => props.onClickCloseModal()}
      style={{ overflow: 'visible', height: modalHeight }}
      width={660}
    >
      <div className="profileWidgetModal">
        <div className="profileWidgetModal__form">
          <Dropdown
            onChange={(athleteId) => {
              props.onSelectAthlete(athleteId);
            }}
            items={_orderBy(
              props.athletes.map((athlete) => ({
                id: `${athlete.id}`,
                title: athlete.fullname,
              })),
              'title'
            )}
            label={props.t('#sport_specific__Athlete')}
            optional
            value={props.athleteId ? props.athleteId.toString() : ''}
          />
          <span className="profileWidgetModal__optionalText">
            {props.t('Optional')}
          </span>
          <div className="profileWidgetModal__pictureOverlays">
            <label className="profileWidgetModal__label">
              {props.t('Picture overlays')}
            </label>
            <div className="profileWidgetModal__overlayCheckboxes">
              <Checkbox
                id="availabilityIndicator"
                label={props.t('Availability Indicator')}
                isChecked={props.showAvailabilityIndicator}
                toggle={(checkbox) => {
                  props.onSetAvatarAvailability(checkbox.checked);
                }}
              />
              {window.featureFlags['squad-numbers'] ? (
                <Checkbox
                  id="squadNumber"
                  label={props.t('#sport_specific__Squad_Number')}
                  isChecked={props.showSquadNumber}
                  toggle={(checkbox) => {
                    props.onSetAvatarSquadNumber(checkbox.checked);
                  }}
                />
              ) : null}
            </div>

            {isDashboardUIUpgrade && (
              <div className="profileWidgetModal__backgroundColourOptions">
                <label className="profileWidgetModal__label">
                  {props.t('Background Colour')}
                </label>
                <div className="profileWidgetModal__backgroundColourOptions--container">
                  <Dropdown
                    data-testid="ProfileWidgetModal|BackgroundColourTypes"
                    items={backgroundColorDropdownItems()}
                    onChange={(type) => {
                      setBackgroundColourType(type);
                      onSetBackgroundColourProps(type);
                    }}
                    value={backgroundColourType}
                  />
                  {backgroundColourType === 'custom' && (
                    <div className="profileWidgetModal__backgroundColourPicker">
                      <ColorPicker
                        initialColor={props.backgroundColour}
                        onChange={props.onSetBackgroundColour}
                        onDeleteColor={() => {}}
                        presetColors={graphSeriesColors()}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="profileWidgetModal__widgetInfo">
              <label className="profileWidgetModal__label">
                {props.t('Widget Info')}
              </label>
              <div className="profileWidgetModal__widgetInfoItem">
                <span className="profileWidgetModal__largeNumberCircle">1</span>
                <Dropdown
                  onChange={(itemId) => {
                    props.onSelectWidgetInfoItem(0, itemId);
                  }}
                  items={profileWidgetDropdownItems()}
                  optional
                  value={props.selectedInfoFields[0].name}
                />
              </div>
              <div className="profileWidgetModal__widgetInfoItem">
                <span className="profileWidgetModal__largeNumberCircle">2</span>
                <Dropdown
                  onChange={(itemId) => {
                    props.onSelectWidgetInfoItem(1, itemId);
                  }}
                  items={profileWidgetDropdownItems()}
                  optional
                  value={props.selectedInfoFields[1].name}
                />
              </div>
              <div className="profileWidgetModal__widgetInfoItem">
                <span className="profileWidgetModal__largeNumberCircle">3</span>
                <Dropdown
                  onChange={(itemId) => {
                    props.onSelectWidgetInfoItem(2, itemId);
                  }}
                  items={profileWidgetDropdownItems()}
                  optional
                  value={props.selectedInfoFields[2].name}
                />
              </div>
              <div className="profileWidgetModal__widgetInfoItem">
                <span className="profileWidgetModal__largeNumberCircle">4</span>
                <Dropdown
                  onChange={(itemId) => {
                    props.onSelectWidgetInfoItem(3, itemId);
                  }}
                  items={profileWidgetDropdownItems()}
                  optional
                  value={props.selectedInfoFields[3].name}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="profileWidgetModal__footer">
          <TextButton
            text={props.t('Save')}
            size="small"
            type="primary"
            onClick={onSave}
          />
        </div>
      </div>
      <div className={classes.preview}>
        <label className="profileWidgetModal__label">
          {props.t('Preview:')}
        </label>
        <ProfileWidget
          athleteId={props.previewData.athlete_id}
          availabilityStatus={props.previewData.availability_status}
          canManageDashboard={props.canManageDashboard}
          fieldInformation={props.previewData.field_values}
          imageUrl={props.previewData.avatar_url}
          isPreview
          onDelete={() => {}}
          onDuplicate={() => {}}
          onEdit={() => {}}
          selectedInfoFields={props.selectedInfoFields}
          showAvailabilityIndicator={props.showAvailabilityIndicator}
          showSquadNumber={props.showSquadNumber}
          backgroundColour={props.backgroundColour}
        />
        <div className={classes.previewNumbers}>
          {PREVIEW_FIELD_NUMBERS.map((number) => (
            <span className={classes.smallNumberCircle}>{number}</span>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default ProfileWidgetModal;
export const ProfileWidgetModalTranslated =
  withNamespaces()(ProfileWidgetModal);
