// @flow
import { withNamespaces } from 'react-i18next';

import { Checkbox } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { Decorators } from '@kitman/modules/src/analysis/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  decorators: Decorators,
  onChange: Function,
  visible: Decorators,
};

const DecoratorSelector = (props: I18nProps<Props>) => {
  const updateDecorators = (checkbox) => {
    const newDecorators = Object.assign({}, props.decorators);
    newDecorators[checkbox.id] = checkbox.checked;
    props.onChange(newDecorators);
  };

  return (
    <div className="graphComposerDecoratorSelector">
      {props.visible.injuries && (
        <span className="graphComposerDecoratorSelector__checkbox">
          <Checkbox
            id="injuries"
            label={props.t('Injuries')}
            isChecked={props.decorators.injuries}
            toggle={(checkbox) => {
              TrackEvent('Graph Builder', 'Click', 'Select Injuries');
              updateDecorators(checkbox);
            }}
          />
        </span>
      )}
      {props.visible.illnesses && (
        <span className="graphComposerDecoratorSelector__checkbox">
          <Checkbox
            id="illnesses"
            label={props.t('Illnesses')}
            isChecked={props.decorators.illnesses}
            toggle={(checkbox) => {
              TrackEvent('Graph Builder', 'Click', 'Select Illnesses');
              updateDecorators(checkbox);
            }}
          />
        </span>
      )}
      {props.visible.data_labels && (
        <span className="graphComposerDecoratorSelector__checkbox">
          <Checkbox
            id="data_labels"
            label={props.t('Data Labels')}
            isChecked={props.decorators.data_labels}
            toggle={(checkbox) => {
              TrackEvent('Graph Builder', 'Click', 'Select Data Labels');
              updateDecorators(checkbox);
            }}
          />
        </span>
      )}

      {props.visible.hide_zeros && (
        <span className="graphComposerDecoratorSelector__checkbox">
          <Checkbox
            id="hide_zeros"
            label={props.t('Hide Zero Values')}
            isChecked={props.decorators.hide_zeros}
            toggle={(checkbox) => {
              TrackEvent('Graph Builder', 'Click', 'Select Hide Zero Values');
              updateDecorators(checkbox);
            }}
          />
        </span>
      )}

      {props.visible.hide_nulls && (
        <span className="graphComposerDecoratorSelector__checkbox">
          <Checkbox
            id="hide_nulls"
            label={props.t('Hide Null Values')}
            isChecked={props.decorators.hide_nulls}
            toggle={(checkbox) => {
              TrackEvent('Graph Builder', 'Click', 'Select Hide Null Values');
              updateDecorators(checkbox);
            }}
          />
        </span>
      )}
    </div>
  );
};

export const DecoratorSelectorTranslated = withNamespaces()(DecoratorSelector);
export default DecoratorSelector;
