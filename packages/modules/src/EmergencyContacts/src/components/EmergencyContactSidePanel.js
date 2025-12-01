// @flow
import { withNamespaces } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  SlidingPanelResponsive as SlidingPanel,
  TextButton,
} from '@kitman/components';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { EmergencyContactState } from '../types';
import { EmergencyContactsTranslated as EmergencyContact } from './EmergencyContact';
import type { EmergencyContactValidity } from './EmergencyContact';
import {
  validateEmergencyContact,
  isContactValid,
} from '../EmergencyContactValidationHelper';
import { useGetRelationTypesQuery } from '../redux/services/emergencyContactsApi';

type Props = {
  isOpen: boolean,
  contact: EmergencyContactState,
  onClose: Function,
  onSave: Function,
};

const style = {
  screenCover: css`
    background-color: ${colors.transparent_background};
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1001;
    animation: fadeIn 0.25s 1 forwards;

    @keyframes fadeIn {
      from {
        background-color: ${colors.transparent_background};
      }
      to {
        background-color: ${colors.semi_transparent_background};
      }
    }
  `,
  content: css`
    color: ${colors.grey_100};
    font-size: 14px;
    font-weight: 600;
  `,
  indent: css`
    margin: 0 30px;
    height: calc(100vh - 200px);
    overflow: auto;
  `,
  sidePanelFooter: css`
    align-items: center;
    background: #fff;
    border-top: 1px solid ${colors.s14};
    display: flex;
    height: 80px;
    justify-content: space-between;
    padding: 0 30px;
    position: absolute;
    text-align: center;
    width: 100%;
  `,
};

const allValid: EmergencyContactValidity = {
  firstname: [],
  lastname: [],
  email: [],
  phone_numbers: [],
  contact_relation: [],
  address_1: [],
  address_2: [],
  address_3: [],
  city: [],
  state_county: [],
  zip_postal_code: [],
  country: [],
};

const EmergencyContactSidePanel = (props: I18nProps<Props>) => {
  const [contact, setContact] = useState<EmergencyContactState>(props.contact);
  const [validationResult, setValidationResult] =
    useState<EmergencyContactValidity>(allValid);
  const [valid, setValid] = useState(true);
  const [haveAttemptedSave, setHaveAttemptedSave] = useState(false);
  const { data: relationOptions = [] } = useGetRelationTypesQuery();

  useEffect(() => {
    if (!props.isOpen) {
      setValidationResult(allValid);
      setHaveAttemptedSave(false);
      setValid(true);
    }
  }, [props.isOpen]);

  const attemptSave = () => {
    setHaveAttemptedSave(true);
    const localValidationResult = validateEmergencyContact(contact);
    const checkValidLocal = isContactValid(localValidationResult);
    setValidationResult(localValidationResult);
    setValid(checkValidLocal);
    if (checkValidLocal) {
      const cleanContact = { ...contact };
      // Remove empty phone numbers
      cleanContact.phone_numbers = cleanContact.phone_numbers?.filter(
        (phone) => phone.number.trim() !== '' || phone.country.trim() !== ''
      );
      props
        .onSave(cleanContact)
        .unwrap()
        .then(() => {
          props.onClose();
        })
        .catch((remoteValidationResults: ?EmergencyContactValidity) => {
          if (remoteValidationResults) {
            const checkValidRemote = isContactValid(remoteValidationResults);
            setValidationResult(remoteValidationResults);
            setValid(checkValidRemote);
          }
        });
    }
  };

  return (
    <>
      {props.isOpen && <div css={style.screenCover} />}
      <SlidingPanel
        width={460}
        isOpen={props.isOpen}
        title={
          props.contact.id
            ? props.t('Edit emergency contact')
            : props.t('Add emergency contact')
        }
        onClose={props.onClose}
      >
        <div css={style.content}>
          <div css={style.indent}>
            <EmergencyContact
              contact={props.contact}
              relationOptions={relationOptions ?? []}
              readOnly={false}
              doubleRowLayout={false}
              onChange={(updatedContact: EmergencyContactState) => {
                setContact(updatedContact);
                if (haveAttemptedSave) {
                  const localValidationResult =
                    validateEmergencyContact(updatedContact);
                  const checkValid = isContactValid(localValidationResult);
                  setValid(checkValid);
                }
              }}
              validationResult={validationResult}
            />
          </div>
          <div css={style.sidePanelFooter}>
            <TextButton
              onClick={props.onClose}
              type="secondary"
              text={props.t('Cancel')}
              kitmanDesignSystem
            />

            <TextButton
              onClick={attemptSave}
              type="primary"
              text={props.t('Save')}
              isSubmit
              kitmanDesignSystem
              isDisabled={!valid}
            />
          </div>
        </div>
      </SlidingPanel>
    </>
  );
};

export default EmergencyContactSidePanel;
export const EmergencyContactSidePanelTranslated = withNamespaces()(
  EmergencyContactSidePanel
);
