// @flow
import {
  InputTextField,
  Select,
  EditInPlace,
  IconButton,
  Link,
} from '@kitman/components';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getAmericanStateOptions } from '../../../utils';
import styles from './styles';
import { updateAdditionalInformationField } from '../../../redux/actions';

type Props = {
  athleteData: Athlete,
};

// Formats '123456789' to '123-45-6789'
export const formatSSN = (ssn: string) => {
  if (ssn?.length > 8) {
    return `${ssn.substring(0, 3)}-${ssn.substring(3, 5)}-${ssn.substring(
      5,
      ssn.length
    )}`;
  }
  return '-';
};

const AdditionalInformation = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const additionalInformation = useSelector(
    (state) => state.addWorkersCompSidePanel.additionalInformation
  );

  const ssnVal =
    additionalInformation.socialSecurityNumber?.length > 8
      ? `xxx-xx-${additionalInformation.socialSecurityNumber.substring(
          additionalInformation.socialSecurityNumber.toString().length - 4
        )}`
      : '-';

  const handleValidationCSS = (storeState: string) => {
    return storeState === null || storeState === '' || storeState === undefined
      ? styles.isInvalid
      : styles.inputLabel;
  };

  return (
    <div data-testid="AdditionalInformation" css={styles.content}>
      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t('Party')}
      </h5>
      <div css={styles.firstName} data-testid="AdditionalInformation|FirstName">
        <label css={handleValidationCSS(additionalInformation.firstName)}>
          {props.t('First name')}
        </label>
        <EditInPlace
          value={additionalInformation.firstName}
          onChange={(value) => {
            dispatch(updateAdditionalInformationField('firstName', value));
          }}
        />
      </div>

      <div css={styles.lastName} data-testid="AdditionalInformation|LastName">
        <label css={handleValidationCSS(additionalInformation.lastName)}>
          {props.t('Last name')}
        </label>
        <EditInPlace
          value={additionalInformation.lastName}
          onChange={(value) => {
            dispatch(updateAdditionalInformationField('lastName', value));
          }}
        />
      </div>

      <div data-testid="AdditionalInformation|DateOfBirth">
        <label css={handleValidationCSS(additionalInformation.dateOfBirth)}>
          {props.t('Date of birth')}
        </label>
        <p data-testid="AdditionalInformation|DateOfBirthValue">
          {additionalInformation.dateOfBirth || '-'}
        </p>
      </div>

      <div
        css={styles.socialSecurityNumber}
        data-testid="AdditionalInformation|SocialSecurityNumber"
      >
        <label
          css={handleValidationCSS(additionalInformation.socialSecurityNumber)}
        >
          {props.t('Social security number')}
        </label>
        <span
          css={handleValidationCSS(additionalInformation.socialSecurityNumber)}
        >
          <Link
            openInNewTab
            href={`/settings/athletes/${props.athleteData.id}/edit`}
          >
            <IconButton
              icon="icon-new-tab"
              isSmall
              isBorderless
              isTransparent
              customStyles={{ color: 'inherit' }}
            />
          </Link>
        </span>
        <h6>{ssnVal}</h6>
      </div>

      <div css={styles.position} data-testid="AdditionalInformation|Position">
        <label css={styles.inputLabel}>{props.t('Roster position')}</label>
        <p data-testid="AdditionalInformation|PositionValue">
          {additionalInformation.position || '-'}
        </p>
      </div>

      <hr css={styles.lineDivider} />

      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t('Address')}
      </h5>
      <div css={styles.address1} data-testid="AdditionalInformation|Address1">
        <InputTextField
          value={additionalInformation.address1}
          label={props.t('Address 1')}
          required
          kitmanDesignSystem
          onChange={(event) =>
            dispatch(
              updateAdditionalInformationField('address1', event.target.value)
            )
          }
        />
      </div>

      <div css={styles.address2} data-testid="AdditionalInformation|Address2">
        <InputTextField
          value={additionalInformation.address2}
          label={props.t('Address 2')}
          optional
          kitmanDesignSystem
          onChange={(event) =>
            dispatch(
              updateAdditionalInformationField('address2', event.target.value)
            )
          }
        />
      </div>

      <div data-testid="AdditionalInformation|City">
        <InputTextField
          value={additionalInformation.city}
          label={props.t('City')}
          kitmanDesignSystem
          onChange={(event) =>
            dispatch(
              updateAdditionalInformationField('city', event.target.value)
            )
          }
        />
      </div>

      <div data-testid="AdditionalInformation|State">
        <Select
          label={props.t('State')}
          onChange={(state) =>
            dispatch(updateAdditionalInformationField('state', state))
          }
          value={additionalInformation.state}
          options={getAmericanStateOptions()}
        />
      </div>

      <div data-testid="AdditionalInformation|ZipCode">
        <InputTextField
          value={additionalInformation.zipCode}
          label={props.t('Zip code')}
          kitmanDesignSystem
          onChange={(event) =>
            dispatch(
              updateAdditionalInformationField('zipCode', event.target.value)
            )
          }
        />
      </div>

      <hr css={styles.lineDivider} />

      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t('Phone')}
      </h5>
      <div
        css={styles.phoneNumber}
        data-testid="AdditionalInformation|PhoneNumber"
      >
        <InputTextField
          value={additionalInformation.phoneNumber}
          label={props.t('Phone number')}
          kitmanDesignSystem
          onChange={(event) =>
            dispatch(
              updateAdditionalInformationField(
                'phoneNumber',
                event.target.value
              )
            )
          }
          optional
        />
      </div>
    </div>
  );
};

export const AdditionalInformationTranslated = withNamespaces()(
  AdditionalInformation
);
export default AdditionalInformation;
