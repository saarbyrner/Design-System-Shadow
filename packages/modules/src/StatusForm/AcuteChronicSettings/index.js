// @flow
import { withNamespaces } from 'react-i18next';
import { Checkbox } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  onSettingsChange: Function,
  settings: Object,
};

export const AcuteChronicSettings = (props: I18nProps<Props>) => {
  const handleSettingsChange = (key: string, value: boolean) => {
    const newSettings = Object.assign({}, props.settings, {
      summary: {
        ratio: key === 'ratio' ? value : props.settings.summary.ratio,
        acute: key === 'acute' ? value : props.settings.summary.acute,
        chronic: key === 'chronic' ? value : props.settings.summary.chronic,
      },
    });

    // Don't allow no checkboxes to be checked
    if (
      !newSettings.summary.ratio &&
      !newSettings.summary.acute &&
      !newSettings.summary.chronic
    ) {
      return;
    }

    props.onSettingsChange(newSettings);
  };

  return (
    <div className="statusForm__row row">
      <div className="col-xl-6">
        <div className="acuteChronic">
          <label className="acuteChronic__viewLabel">{props.t('View')}</label>
          <div className="acuteChronic__checkboxes checkboxGroup">
            <span className="acuteChronic__checkbox">
              <Checkbox
                id="acute_to_chronic_ratio_checkbox"
                label={props.t('Ratio')}
                isChecked={props.settings.summary.ratio}
                toggle={(checkbox) => {
                  handleSettingsChange('ratio', checkbox.checked);
                }}
              />
            </span>
            <span className="acuteChronic__checkbox">
              <Checkbox
                id="acute_to_chronic_acute_checkbox"
                label={props.t('Acute')}
                isChecked={props.settings.summary.acute}
                toggle={(checkbox) => {
                  handleSettingsChange('acute', checkbox.checked);
                }}
              />
            </span>
            <span className="acuteChronic__checkbox">
              <Checkbox
                id="acute_to_chronic_chronic_checkbox"
                label={props.t('Chronic')}
                isChecked={props.settings.summary.chronic}
                toggle={(checkbox) => {
                  handleSettingsChange('chronic', checkbox.checked);
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AcuteChronicSettingsTranslated =
  withNamespaces()(AcuteChronicSettings);
