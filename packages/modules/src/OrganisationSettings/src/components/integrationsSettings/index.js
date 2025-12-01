// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { AppStatus, SettingWidget } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ActiveIntegrationListItem } from '../../types';

type Props = {
  activeIntegrations: Array<ActiveIntegrationListItem>,
  fetchActiveIntegrations: Function,
  fetchAvailableIntegrations: Function,
  onClickAddIntegration: Function,
  onClickUnlinkIntegration: Function,
};

const IntegrationsSettings = (props: I18nProps<Props>) => {
  const [feedbackModalStatus, setFeedbackModalStatus] = useState(null);
  const [feedbackModalMessage, setFeedbackModalMessage] = useState(null);

  useEffect(() => {
    props.fetchActiveIntegrations();
    props.fetchAvailableIntegrations();
  }, []);

  const renderActiveIntegrationRows = () => {
    return props.activeIntegrations.map(
      // eslint-disable-next-line camelcase
      ({ id, name, expiry_date, unlink_url }) => {
        return (
          <tr key={id}>
            <td>{name}</td>
            <td>{moment(expiry_date).format('LLL')}</td>
            <td
              className="organisationIntegrationsSettings__unlinkIntegration"
              onClick={() => props.onClickUnlinkIntegration(id, unlink_url)}
            >
              {props.t('Unlink')}
            </td>
          </tr>
        );
      }
    );
  };

  return (
    <>
      <div className="organisationIntegrationsSettings">
        <div className="organisationIntegrationsSettings__title">
          <h6>{props.t('Integrations')}</h6>
        </div>
        <div className="organisationIntegrationsSettings__content">
          <SettingWidget
            title={props.t('Vendors')}
            actionButtonText="Add"
            onClickActionButton={() => {
              props.onClickAddIntegration();
            }}
            kitmanDesignSystem
          >
            {props.activeIntegrations.length ? (
              <table className="organisationIntegrationsSettings__activeIntegrationsTable">
                <thead>
                  <tr>
                    <th>{props.t('Name')}</th>
                    <th>{props.t('Expiry Date')}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{renderActiveIntegrationRows()}</tbody>
              </table>
            ) : (
              <p className="organisationIntegrationsSettings__noActiveIntegrations">
                {props.t('No integrations set up')}
              </p>
            )}
          </SettingWidget>
        </div>
      </div>

      <AppStatus
        status={feedbackModalStatus}
        message={feedbackModalMessage}
        hideConfirmation={() => {
          setFeedbackModalStatus(null);
          setFeedbackModalMessage(null);
        }}
        close={() => {
          setFeedbackModalStatus(null);
          setFeedbackModalMessage(null);
        }}
      />
    </>
  );
};

export const IntegrationsSettingsTranslated =
  withNamespaces()(IntegrationsSettings);
export default IntegrationsSettings;
