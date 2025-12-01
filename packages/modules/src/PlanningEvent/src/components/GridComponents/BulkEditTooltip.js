// @flow

import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  ActionTooltip,
  InputNumeric,
  Select,
  ToggleSwitch,
} from '@kitman/components';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const BulkEditTooltip = (
  props: I18nProps<{
    type: 'TOGGLE' | 'SELECT' | 'INPUT',
    options?: Array<Option>,
    columnName: string,
    onApply: Function,
    onValidate?: Function,
    isValid?: boolean,
    error?: string,
  }>
) => {
  const [value, setValue] = useState();
  const [showError, setShowError] = useState(false);

  const handleApply = () => {
    if (props.isValid) {
      props.onApply(value);
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="planningEventBulkEditTooltip">
      <ActionTooltip
        placement="bottom-start"
        actionSettings={{
          text: props.t('Apply'),
          onCallAction: () => handleApply(),
          preventCloseOnActionClick: !props.isValid,
        }}
        content={
          <div className="planningEventBulkEditTooltip__content">
            <div className="planningEventBulkEditTooltip__label">
              {props.t('Set all')}
            </div>

            {props.type === 'SELECT' && (
              <div className="planningEventBulkEditTooltip__dropdown">
                <Select
                  value={value}
                  options={props.options}
                  onChange={(selectedValue) => setValue(selectedValue)}
                />
              </div>
            )}

            {props.type === 'TOGGLE' && (
              <div className="planningEventBulkEditTooltip__toggle">
                <ToggleSwitch
                  isSwitchedOn={value}
                  toggle={() => setValue((preValue) => !preValue)}
                />
              </div>
            )}

            {props.type === 'INPUT' && (
              <div className="planningEventBulkEditTooltip__input">
                <InputNumeric
                  value={value ?? undefined}
                  onChange={(updatedValue) => {
                    setShowError(false);
                    setValue(updatedValue);
                    if (props.onValidate) {
                      props.onValidate(updatedValue);
                    }
                  }}
                  size="small"
                  kitmanDesignSystem
                  isInvalid={showError}
                />
                {showError ? (
                  <span className="planningEventBulkEditTooltip__input--error">
                    {props.error}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        }
        triggerElement={
          <div className="planningEventBulkEditTooltip__bulkCTA">
            {props.columnName}
            <i className="icon-chevron-down" />
          </div>
        }
        triggerFullWidth
      />
    </div>
  );
};

BulkEditTooltip.defaultProps = {
  isValid: true,
};

export const BulkEditTooltipTranslated = withNamespaces()(BulkEditTooltip);
export default BulkEditTooltip;
