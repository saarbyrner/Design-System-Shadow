// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';

import { IconButton, PageHeader } from '@kitman/components';
import type { MultiSelectDropdownItem } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useBrowserTabTitle } from '@kitman/common/src/hooks';

import AlertEditModal from '../containers/AlertEditModal';
import DuplicateAlertModal from '../containers/DuplicateAlertModal';
import AppStatus from '../containers/AppStatus';
import type { Alert } from '../../types';

type Props = {
  alerts: Array<Alert>,
  onClickEditAlert: Function,
  users: Array<MultiSelectDropdownItem>,
  variables: Array<MultiSelectDropdownItem>,
  onClickActivateAlert: Function,
  onClickCreateAlert: Function,
  onClickDeleteAlert: Function,
  onClickDuplicateAlert: Function,
  canEditAlerts: boolean,
  canAddAlerts: boolean,
  canDeleteAlerts: boolean,
};

const App = (props: I18nProps<Props>) => {
  useBrowserTabTitle(props.t('Manage Alerts'));

  const getUserFullname = (userId: number) => {
    const currentUser = props.users.find(
      (userItem) => userItem.id === `${userId}`
    );
    return currentUser ? currentUser.name : '';
  };

  const getVariableName = (variableId: number) => {
    const currentVariable = props.variables.find(
      (variableItem) => variableItem.id === `${variableId}`
    );
    return currentVariable ? currentVariable.name : '';
  };

  const getAlertVariables = (alert: Alert) => {
    return (
      alert.training_variable_ids.length > 0 &&
      alert.training_variable_ids.map((variableId, index) => (
        <div key={variableId}>
          <span>
            {/* $FlowFixMe variable must exist at this point */}
            {getVariableName(variableId)}
          </span>
          {index !== alert.training_variable_ids.length - 1 && <>, </>}
        </div>
      ))
    );
  };

  const getAlertUsers = (alert: Alert) => {
    return (
      alert.notification_recipient_ids.length > 0 &&
      alert.notification_recipient_ids.map((userId, index) => (
        <div key={userId}>
          {/* $FlowFixMe user must exist at this point */}
          <span>{getUserFullname(userId)}</span>
          {index !== alert.notification_recipient_ids.length - 1 && <>, </>}
        </div>
      ))
    );
  };

  const getAlerts = () => {
    return (
      props.alerts.length > 0 &&
      props.alerts.map((alert) => (
        <tr key={alert.id} className="alertsTable__row">
          {props.canEditAlerts ? (
            <td
              className={classNames(
                'alertsTable__cell',
                'alertsTable__activateBtn',
                {
                  'alertsTable__activateBtn--active': alert.active,
                }
              )}
            >
              <IconButton
                icon={alert.active ? 'icon-tick-active' : 'icon-tick'}
                isTransparent
                onClick={() => props.onClickActivateAlert(alert)}
              />
            </td>
          ) : null}
          <td className="alertsTable__cell">{alert.name}</td>
          <td className="alertsTable__cell">{getAlertVariables(alert)}</td>
          <td className="alertsTable__cell">
            <span>{alert.notification_message}</span>
          </td>
          <td className="alertsTable__cell">{getAlertUsers(alert)}</td>
          <td className="alertsTable__cell alertsTable__cell--btn">
            <div className="alertsTable__btnContainer">
              {props.canEditAlerts && (
                <>
                  {window.featureFlags['duplicate-alerts'] && (
                    <button
                      type="button"
                      onClick={() => props.onClickDuplicateAlert(alert.id)}
                      className="icon-duplicate alertsTable__button"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => props.onClickEditAlert(alert.id)}
                    className="icon-edit alertsTable__button"
                  />
                </>
              )}
              {window.featureFlags['alerts-add-edit-delete'] &&
                props.canDeleteAlerts && (
                  <button
                    type="button"
                    onClick={() => props.onClickDeleteAlert(alert)}
                    className="icon-bin alertsTable__button"
                  />
                )}
            </div>
          </td>
        </tr>
      ))
    );
  };

  return (
    <div className="alerts">
      <PageHeader>
        <div className="alertsHeader">
          <h6>{props.t('Alerts')}</h6>
          {window.featureFlags['alerts-add-edit-delete'] &&
            props.canAddAlerts && (
              <div className="alertsHeader__btnContainer">
                <IconButton
                  icon="icon-add"
                  text={props.t('Add Alert')}
                  onClick={() => props.onClickCreateAlert(null)}
                />
              </div>
            )}
        </div>
      </PageHeader>
      {props.alerts.length > 0 ? (
        <table className="table km-table alertsTable">
          <thead>
            <tr>
              {props.canEditAlerts ? <th /> : null}
              <th>{props.t('Name')}</th>
              <th>{props.t('Variables')}</th>
              <th>{props.t('Message')}</th>
              <th>{props.t('Send to')}</th>
              {props.canEditAlerts ? <th /> : null}
            </tr>
          </thead>
          <tbody>{getAlerts()}</tbody>
        </table>
      ) : (
        <div className="alerts__emtpyMsg">
          {props.t('There are no alerts saved.')}
        </div>
      )}
      <AlertEditModal />
      <DuplicateAlertModal />
      <AppStatus />
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
