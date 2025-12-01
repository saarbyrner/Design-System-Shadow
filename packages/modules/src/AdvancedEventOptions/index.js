// @flow
import { withNamespaces } from 'react-i18next';
import { Dropdown, GroupedDropdown, InputNumeric } from '@kitman/components';

import type { GameFormData } from '@kitman/modules/src/GameModal/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { TrainingSessionFormData } from '@kitman/modules/src/TrainingSessionModal/src/types';

type Props = {
  formData: TrainingSessionFormData | GameFormData,
  surfaceType: string,
  surfaceQuality: string,
  weather: string,
  temperature: string,
  handleSurfaceTypeChange: Function,
  handleSurfaceQualityChange: Function,
  handleWeatherChange: Function,
  handleTemperatureChange: Function,
};

const AdvancedEventOptions = (props: I18nProps<Props>) => {
  return (
    <div className="advancedEventOptions">
      <div className="advancedEventOptions__formSeparator" />
      <div className="row">
        <div className="col-md-12 advancedEventOptions__advancedButton">
          {props.t('Additional options')}
        </div>
      </div>

      <br />

      <div className="row advancedEventOptions__advancedOptions">
        <div className="col-md-3">
          <GroupedDropdown
            label={props.t('Surface Type')}
            inputName="advanced_option_surface_type"
            options={props.formData.surfaceTypes}
            onChange={(item) => props.handleSurfaceTypeChange(item.id)}
            clearBtn
            onClickClear={() => props.handleSurfaceTypeChange('')}
            value={props.surfaceType}
          />
        </div>
        <div className="col-md-3">
          <Dropdown
            name="surfaceQuality"
            label={props.t('Surface Quality')}
            items={props.formData.surfaceQualities}
            onChange={props.handleSurfaceQualityChange}
            value={props.surfaceQuality}
            hiddenNoneOption
            clearBtn
            onClickClear={() => props.handleSurfaceQualityChange('')}
            optional
          />
        </div>
        <div className="col-md-3">
          <Dropdown
            name="weather"
            label={props.t('Weather')}
            items={props.formData.weathers}
            onChange={props.handleWeatherChange}
            value={props.weather}
            hiddenNoneOption
            clearBtn
            onClickClear={() => props.handleWeatherChange('')}
            optional
          />
        </div>
        <div className="col-md-3">
          <InputNumeric
            label={props.t('Temperature')}
            name="temperature"
            value={props.temperature}
            onChange={props.handleTemperatureChange}
            descriptor={`°${props.formData.temperatureUnit}`}
            t={props.t}
            optional
          />
        </div>
      </div>
    </div>
  );
};

export const AdvancedEventOptionsTranslated =
  withNamespaces()(AdvancedEventOptions);
export default AdvancedEventOptions;
