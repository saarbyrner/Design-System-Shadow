// @flow
import { withNamespaces } from 'react-i18next';
import { Fragment, useState, useEffect } from 'react';
import { Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { EmergencyContactsTranslated as EmergencyContact } from './EmergencyContact';
import { useGetRelationTypesQuery } from '../redux/services/emergencyContactsApi';
import type { EmergencyContactState } from '../types';
import styling from './style';

type Props = {
  contacts: Array<EmergencyContactState>,
  onRemoveEmergencyContact: Function,
  onGetEmergencyContacts: Function,
  onEditEmergencyContact: Function,
};

const EmergencyContacts = (props: I18nProps<Props>) => {
  const [emergencyContactForRemoval, setEmergencyContactForRemoval] =
    useState<?number>(null);
  const { data: relationOptions = [] } = useGetRelationTypesQuery();

  useEffect(() => {
    props.onGetEmergencyContacts();
  }, []);

  const style = styling();
  return (
    <div css={style.contentContainer}>
      <div css={style.mainHeader}>
        <h2 className="kitmanHeading--L2">{props.t('Emergency contacts')}</h2>
        <span css={style.mainButtons}>
          <TextButton
            text={props.t('Add contact')}
            type="primary"
            onClick={() => {
              props.onEditEmergencyContact(null);
            }}
            kitmanDesignSystem
          />
        </span>
      </div>
      {props.contacts.length === 0 && (
        <div css={style.noContacts}>{props.t('No contact added')}</div>
      )}
      {props.contacts.map((contact: EmergencyContactState, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={`emergency_contact_${index}`}>
          <div css={style.contactHeading}>
            <h4 className="kitmanHeading--L4">
              {props.t('Contact')} {index + 1}
            </h4>
            <div css={style.buttonContainer}>
              <TextButton
                iconBefore="icon-edit"
                type="subtle"
                onClick={() => props.onEditEmergencyContact(contact.id)}
                kitmanDesignSystem
              />
              <TextButton
                iconBefore="icon-bin"
                type="subtle"
                onClick={() => setEmergencyContactForRemoval(contact.id)}
                kitmanDesignSystem
              />
            </div>
          </div>
          <EmergencyContact
            contact={contact}
            relationOptions={relationOptions ?? []}
            readOnly
            doubleRowLayout
          />
        </Fragment>
      ))}
      <Modal
        isOpen={emergencyContactForRemoval !== null}
        onPressEscape={() => setEmergencyContactForRemoval(null)}
        close={() => setEmergencyContactForRemoval(null)}
      >
        <Modal.Header>
          <Modal.Title>{props.t('Delete emergency contact')}</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          {props.t('Delete this emergency contact?')}
        </Modal.Content>

        <Modal.Footer>
          <TextButton
            text={props.t('Cancel')}
            onClick={() => setEmergencyContactForRemoval(null)}
            kitmanDesignSystem
          />
          <TextButton
            text={props.t('Delete')}
            type="primaryDestruct"
            onClick={() => {
              props.onRemoveEmergencyContact(emergencyContactForRemoval);
              setEmergencyContactForRemoval(null);
            }}
            kitmanDesignSystem
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export const EmergencyContactsTranslated = withNamespaces()(EmergencyContacts);
export default EmergencyContacts;
