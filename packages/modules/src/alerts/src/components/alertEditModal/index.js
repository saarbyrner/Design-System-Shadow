// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  Dropdown,
  FormValidator,
  IconButton,
  InputNumeric,
  InputText,
  LegacyModal as Modal,
  MultiSelectDropdown,
  TextButton,
} from '@kitman/components';
import type { MultiSelectDropdownItem } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import conditionDropdownOptions from '../../../resources/conditionDropdownOptions';
import type { Alert } from '../../../types';

type Props = {
  isOpen: boolean,
  alert: Alert,
  users: Array<MultiSelectDropdownItem>,
  variables: Array<MultiSelectDropdownItem>,
  close: Function,
  selectAlertUsers: Function,
  selectAlertVariables: Function,
  onSaveEditAlert: Function,
  onSaveCreateAlert: Function,
  updateAlertName: Function,
  updateAlertMessage: Function,
  updateAlertVariables: Function,
  updateVariableCondition: Function,
  updateVariableUnit: Function,
  onAddNewVariable: Function,
  onDeleteVariable: Function,
};

function AlertEditModal(props: I18nProps<Props>) {
  const [variableDropdownOptions, setVariableDropdownOptions] = useState([]);

  useEffect(() => {
    const transformedOptions = props.variables.map((variableItem) => ({
      id: variableItem.id,
      title: variableItem.name,
    }));
    setVariableDropdownOptions(transformedOptions);
  }, [props.variables]);

  const stringifyIds = (ids: Array<?number>) => {
    // $FlowFixMe ids length is checked
    return ids.length > 0 ? ids.map((id) => `${id}`) : [];
  };

  const getVariableSections = () => {
    return props.alert.alert_training_variables.map(
      (alertTrainingVariable, index) => (
        <div
          className="alertEditModal__variable"
          key={
            alertTrainingVariable.id || `alertTrainingVariable_blank${index}`
          }
        >
          <div className="alertEditModal__deleteBtn">
            <IconButton
              icon="icon-bin"
              isTransparent
              onClick={() => props.onDeleteVariable(index)}
              isDisabled={props.alert.alert_training_variables.length < 2}
            />
          </div>
          <Dropdown
            searchable
            label={props.t('Variable')}
            name="alertEditModal__variableField"
            items={variableDropdownOptions}
            onChange={(variableId) =>
              props.updateAlertVariables(variableId, index)
            }
            value={
              alertTrainingVariable.training_variable_id
                ? alertTrainingVariable.training_variable_id.toString()
                : ''
            }
          />
          <div className="alertEditModal__variableRow">
            <Dropdown
              label={props.t('Condition')}
              name="alertEditModal__variableConditionField"
              items={conditionDropdownOptions()}
              onChange={(conditionId) =>
                props.updateVariableCondition(conditionId, index)
              }
              value={alertTrainingVariable.condition}
            />
            <InputNumeric
              descriptor={props.t('Unit')}
              value={alertTrainingVariable.value ?? ''}
              onChange={(unitValue) =>
                props.updateVariableUnit(unitValue, index)
              }
              name="alertEditModal__variableUnitField"
            />
          </div>
        </div>
      )
    );
  };

  return (
    <>
      <Modal
        title={props.alert.id ? props.t('Edit Alert') : props.t('Add Alert')}
        isOpen={props.isOpen}
        close={() => props.close()}
        width={600}
      >
        <div className="alertEditModal">
          <FormValidator
            successAction={() => {
              if (props.alert.id) {
                props.onSaveEditAlert();
              } else {
                props.onSaveCreateAlert();
              }
            }}
          >
            <div className="alertEditModal__content">
              <div className="alertEditModal__row">
                <InputText
                  value={props.alert.name}
                  label={props.t('Alert Name')}
                  maxLength={255}
                  onValidation={(input) => props.updateAlertName(input.value)}
                  required
                  disabled={!window.featureFlags['alerts-add-edit-delete']}
                />
              </div>
              <div className="alertEditModal__row">
                {window.getFlag('alerts-numeric-metric') ? (
                  <div className="alertEditModal__variableSections">
                    {getVariableSections()}
                    <TextButton
                      text={props.t('Add another rule')}
                      type="secondary"
                      onClick={() => props.onAddNewVariable()}
                    />
                  </div>
                ) : (
                  <MultiSelectDropdown
                    label={props.t('Variables')}
                    listItems={props.variables}
                    onItemSelect={(variableItem) =>
                      props.selectAlertVariables(variableItem)
                    }
                    selectedItems={stringifyIds(
                      props.alert.training_variable_ids
                    )}
                    invalid={props.alert.training_variable_ids.length === 0}
                  />
                )}
              </div>
              <div className="alertEditModal__row">
                <MultiSelectDropdown
                  label={props.t('Send alert to')}
                  listItems={props.users}
                  onItemSelect={(userItem) => props.selectAlertUsers(userItem)}
                  selectedItems={stringifyIds(
                    props.alert.notification_recipient_ids
                  )}
                />
              </div>
              <div className="alertEditModal__row">
                <InputText
                  value={props.alert.notification_message}
                  onValidation={(input) =>
                    props.updateAlertMessage(input.value)
                  }
                  label={props.t('Message')}
                  maxLength={255}
                  required
                  disabled={!window.featureFlags['alerts-add-edit-delete']}
                />
              </div>
            </div>
            <div className="alertEditModal__footer">
              <TextButton
                text={props.t('Save')}
                type="primary"
                onClick={() => {}}
                isSubmit
              />
            </div>
          </FormValidator>
        </div>
      </Modal>
    </>
  );
}

export default AlertEditModal;
export const AlertEditModalTranslated = withNamespaces()(AlertEditModal);
