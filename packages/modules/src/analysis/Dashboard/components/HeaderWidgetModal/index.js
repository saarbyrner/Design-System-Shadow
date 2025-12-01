// @flow
import { withNamespaces } from 'react-i18next';
import type {
  SquadAthletesSelection,
  SquadAthletes,
} from '@kitman/components/src/types';
import { useMemo, useState } from 'react';
import { trackIntercomEvent } from '@kitman/common/src/utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import {
  LegacyModal as Modal,
  TextButton,
  ColorPicker,
  Checkbox,
  InputRadio,
  Dropdown,
} from '@kitman/components';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { graphSeriesColors } from '@kitman/modules/src/analysis/shared/resources/graph/BaseConfig';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';
import HeaderWidget from '../HeaderWidget';
import AthleteSelector from '../../containers/AthleteSelector';
import {
  backgroundColorDropdownItems,
  backgroundColorValueMap,
  getInitialBackgroundColorOptionValue,
  organisationDetailsValues,
} from '../utils';
import type { BackgroundColourValue } from '../types';

type Props = {
  backgroundColor: string,
  canManageDashboard: boolean,
  userName: string,
  name: string,
  open: boolean,
  onClickCloseModal: Function,
  onClickSaveHeaderWidget: Function,
  onSetHeaderWidgetBackgroundColor: Function,
  onSetHeaderWidgetName: Function,
  onSetHeaderWidgetPopulation: Function,
  onSetShowOrganisationLogo: Function,
  onSetShowOrganisationName: Function,
  onSetHideOrganisationDetails: Function,
  orgLogo: string,
  orgName: string,
  selectedPopulation: SquadAthletesSelection,
  showOrgLogo: boolean,
  showOrgName: boolean,
  hideOrgDetails: boolean,
  squadAthletes: SquadAthletes,
  squadName: string,
  squads: Array<Squad>,
  widgetId: number,
};

function HeaderWidgetModal(props: I18nProps<Props>) {
  const { trackEvent } = useEventTracking();

  const isDashboardUIUpgradeFF = window.getFlag('rep-dashboard-ui-upgrade');

  const initialBackgroundValue: BackgroundColourValue =
    getInitialBackgroundColorOptionValue(props.backgroundColor);
  const [backgroundColorType, setBackgroundColorType] = useState(
    initialBackgroundValue
  );

  const logoValue = useMemo(() => {
    return props.showOrgLogo
      ? organisationDetailsValues.logo
      : organisationDetailsValues.noLogo;
  }, [props.showOrgLogo]);

  const organisationNameValue = useMemo(() => {
    if (props.hideOrgDetails) {
      return organisationDetailsValues.noName;
    }
    return props.showOrgName
      ? organisationDetailsValues.orgName
      : organisationDetailsValues.squadName;
  }, [props.showOrgName, props.hideOrgDetails]);

  const setHeaderWidgetBackgroundColor = (type: string) => {
    props.onSetHeaderWidgetBackgroundColor(backgroundColorValueMap[type]);
  };

  const onSave = () => {
    trackIntercomEvent('header-widget-modal-save');
    // Mixpanel
    trackEvent(reportingEventNames.addHeader);
    props.onClickSaveHeaderWidget(props.widgetId);
  };

  return (
    <Modal
      title={props.t('Header')}
      isOpen={props.open}
      close={() => props.onClickCloseModal()}
      style={{ overflow: 'visible', height: '660px' }}
      width={600}
    >
      <div className="headerWidgetModal">
        <div className="headerWidgetModal__name">
          <label className="headerWidgetModal__label">{props.t('Name')}</label>
          <input
            className="headerWidgetModal__nameInput"
            type="text"
            value={props.name}
            onChange={(e) => props.onSetHeaderWidgetName(e.currentTarget.value)}
          />
          <span className="headerWidgetModal__optionalText">
            {props.t('Optional')}
          </span>
        </div>
        <div className="headerWidgetModal__populationAndColour">
          <div className="headerWidgetModal__population">
            <label className="headerWidgetModal__label">
              {props.t('Population')}
            </label>
            <AthleteSelector
              data-testid="HeaderWidgetModal|AthleteSelector"
              showDropdownButton
              selectedSquadAthletes={props.selectedPopulation}
              onSelectSquadAthletes={(squadAthletesSelection) => {
                props.onSetHeaderWidgetPopulation(squadAthletesSelection);
              }}
            />
            <span className="headerWidgetModal__optionalText">
              {props.t('Optional')}
            </span>
          </div>
          {!isDashboardUIUpgradeFF && (
            <div className="headerWidgetModal__backgroundColour">
              <label className="headerWidgetModal__label">
                {props.t('Background Colour')}
              </label>
              <ColorPicker
                initialColor={props.backgroundColor}
                onChange={props.onSetHeaderWidgetBackgroundColor}
                onDeleteColor={() => {}}
                presetColors={graphSeriesColors()}
              />
            </div>
          )}
          {isDashboardUIUpgradeFF && (
            <div className="headerWidgetModal__backgroundColourType">
              <label className="headerWidgetModal__label">
                {props.t('Background Colour')}
              </label>
              <Dropdown
                data-testid="HeaderWidgetModal|BackgroundColourTypes"
                onChange={(type) => {
                  setBackgroundColorType(type);
                  setHeaderWidgetBackgroundColor(type);
                }}
                items={backgroundColorDropdownItems()}
                value={backgroundColorType}
              />
            </div>
          )}
          {isDashboardUIUpgradeFF && backgroundColorType === 'custom' && (
            <div className="headerWidgetModal__backgroundColourOptions">
              <ColorPicker
                initialColor={props.backgroundColor}
                onChange={props.onSetHeaderWidgetBackgroundColor}
                onDeleteColor={() => {}}
                presetColors={graphSeriesColors()}
              />
            </div>
          )}
        </div>
        {!isDashboardUIUpgradeFF && (
          <div className="headerWidgetModal__overlayCheckboxes">
            <label className="headerWidgetModal__label">
              {props.t('Organisation Details')}
            </label>
            <Checkbox
              id="logo"
              label={props.t('Logo')}
              isChecked={props.showOrgLogo}
              toggle={(checkbox) => {
                props.onSetShowOrganisationLogo(checkbox.checked);
              }}
            />
            <Checkbox
              id="name"
              label={props.t('Name')}
              isChecked={props.showOrgName}
              toggle={(checkbox) => {
                props.onSetShowOrganisationName(checkbox.checked);
              }}
            />
          </div>
        )}
        {isDashboardUIUpgradeFF && (
          <>
            <div className="headerWidgetModal__overlayRadioButtons">
              <label className="headerWidgetModal__label">
                {props.t('Organisation Logo')}
              </label>
              <div className="headerWidgetModal__overlayRadioButtons--logo">
                <InputRadio
                  inputName="logo"
                  index={0}
                  option={{
                    value: organisationDetailsValues.logo,
                    name: props.t('Logo'),
                  }}
                  change={() => props.onSetShowOrganisationLogo(true)}
                  value={logoValue}
                />
                <InputRadio
                  inputName="logo"
                  index={1}
                  option={{
                    value: organisationDetailsValues.noLogo,
                    name: props.t('No Logo'),
                  }}
                  change={() => props.onSetShowOrganisationLogo(false)}
                  value={logoValue}
                />
              </div>
            </div>
            <div className="headerWidgetModal__overlayRadioButtons">
              <label className="headerWidgetModal__label">
                {props.t('Organisation Name')}
              </label>
              <div className="headerWidgetModal__overlayRadioButtons--organistaion_text">
                <InputRadio
                  inputName="organistaion_text"
                  index={0}
                  option={{
                    value: organisationDetailsValues.squadName,
                    name: props.t('Name'),
                  }}
                  change={() => {
                    props.onSetShowOrganisationName(false);
                  }}
                  value={organisationNameValue}
                />
                <InputRadio
                  inputName="organistaion_text"
                  index={1}
                  option={{
                    value: organisationDetailsValues.orgName,
                    name: props.t('Organisation Name'),
                  }}
                  change={() => {
                    props.onSetShowOrganisationName(true);
                  }}
                  value={organisationNameValue}
                />
                <InputRadio
                  inputName="organistaion_text"
                  index={2}
                  option={{
                    value: organisationDetailsValues.noName,
                    name: props.t('No Text'),
                  }}
                  change={() => {
                    props.onSetHideOrganisationDetails(true);
                  }}
                  value={organisationNameValue}
                />
              </div>
            </div>
          </>
        )}
        <div className="headerWidgetModal__preview">
          <label className="headerWidgetModal__label">
            {props.t('Preview')}
          </label>
          <HeaderWidget
            backgroundColor={props.backgroundColor}
            canManageDashboard={props.canManageDashboard}
            userName={props.userName}
            isPreview
            name={props.name}
            onDelete={() => {}}
            onDuplicate={() => {}}
            onEdit={() => {}}
            orgLogo={props.orgLogo}
            orgName={props.orgName}
            hideOrgDetails={props.hideOrgDetails}
            selectedPopulation={props.selectedPopulation}
            showOrgLogo={props.showOrgLogo}
            showOrgName={props.showOrgName}
            squadAthletes={props.squadAthletes}
            squadName={props.squadName}
            squads={props.squads}
          />
        </div>
        <div className="headerWidgetModal__footer">
          <TextButton text={props.t('Save')} type="primary" onClick={onSave} />
        </div>
      </div>
    </Modal>
  );
}

export default HeaderWidgetModal;
export const HeaderWidgetModalTranslated = withNamespaces()(HeaderWidgetModal);
