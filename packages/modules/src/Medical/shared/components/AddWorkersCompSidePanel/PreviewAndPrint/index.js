// @flow
import { useSelector } from 'react-redux';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import styles from './styles';
import { getPathologyTitle } from '../../../utils';
import EllipsisTooltipText from '../../../../../../../components/src/EllipsisTooltipText';
import type { IssueOccurrenceRequested } from '../../../../../../../common/src/types/Issues';
import type { Sides } from '../../../../../../../services/src/services/medical/getSides';
import type { BodyAreas } from '../../../../../../../services/src/services/medical/clinicalImpressions';

type Props = {
  issue: IssueOccurrenceRequested,
  sideDetails: {
    requestStatus: string,
    options: Sides,
  },
  bodyAreaDetails: {
    requestStatus: string,
    options: BodyAreas,
  },
  isPolicyNumberRequired: boolean,
};

const PreviewAndPrint = (props: I18nProps<Props>) => {
  const claimInformation = useSelector(
    (state) => state.addWorkersCompSidePanel.claimInformation
  );
  const additionalInformation = useSelector(
    (state) => state.addWorkersCompSidePanel.additionalInformation
  );

  const isSubmitted = props.issue.workers_comp?.status === 'submitted';

  const formatDate = (value: ?string, titleFormat: boolean = false) => {
    return moment(value, 'YYYY-MM-DD HH:mm:ss').format(
      titleFormat ? 'MM/DD/YYYY' : 'MMM DD, YYYY'
    );
  };

  const handleValidationCSS = (storeState: string) => {
    return storeState === null || storeState === '' || storeState === undefined
      ? styles.isInvalid
      : styles.inputLabel;
  };

  const getDataCSS = () => {
    return isSubmitted ? styles.isSubmitted : styles.data;
  };

  const missingValuePlaceholder = (
    <span css={styles.missingValuePlaceholder}>-</span>
  );

  return (
    <div data-testid="PreviewAndPrint" css={styles.content}>
      <h3
        css={styles.header}
        className="kitmanHeading--L2"
        data-testid="PreviewAndPrint|Title"
      >
        {window.getFlag('pm-mls-emr-demo-froi') ? 'FROI' : 'WC'}
        {getPathologyTitle(props.issue) && (
          <>
            {' - '}
            <EllipsisTooltipText
              content={getPathologyTitle(props.issue)}
              displayEllipsisWidth={400}
            />
          </>
        )}
        {claimInformation.lossDate && (
          <>
            {' - '}
            {formatDate(claimInformation.lossDate, true)}
          </>
        )}
      </h3>

      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t('Claim')}
      </h5>
      <div css={styles.dataContainer}>
        <label
          data-testid="PreviewAndPrint|PersonNameLabel"
          css={handleValidationCSS(claimInformation.personName?.value)}
        >
          {props.t('Reported person name:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|PersonName">
          {claimInformation.personName?.label || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label css={styles.inputLabel}>
          {props.t('Reported person contact phone:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|ContactNumber">
          {claimInformation.contactNumber || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label
          data-testid="PreviewAndPrint|PolicyNumberLabel"
          css={
            props.isPolicyNumberRequired
              ? handleValidationCSS(claimInformation.policyNumber)
              : styles.inputLabel
          }
        >
          {props.t('Policy number:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|PolicyNumber">
          {claimInformation.policyNumber || missingValuePlaceholder}
        </p>
      </div>

      <hr css={styles.lineDivider} />

      <div css={styles.dataContainer}>
        <label
          data-testid="PreviewAndPrint|LossDateLabel"
          css={handleValidationCSS(claimInformation.lossDate)}
        >
          {props.t('Loss date:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|LossDate">
          {claimInformation.lossDate
            ? formatDate(claimInformation.lossDate)
            : '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label
          data-testid="PreviewAndPrint|LossCityLabel"
          css={handleValidationCSS(claimInformation.lossCity)}
        >
          {props.t('Loss city:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|LossCity">
          {claimInformation.lossCity || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label
          data-testid="PreviewAndPrint|LossStateLabel"
          css={handleValidationCSS(claimInformation.lossState)}
        >
          {props.t('Loss state:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|LossState">
          {claimInformation.lossState || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label css={styles.inputLabel}>{props.t('Loss jurisdiction:')}</label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|LossJurisdiction">
          {claimInformation.lossJurisdiction || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label
          data-testid="PreviewAndPrint|LossDescriptionLabel"
          css={handleValidationCSS(claimInformation.lossDescription)}
        >
          {props.t('Loss description:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|LossDescription">
          {claimInformation.lossDescription || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label data-testid="PreviewAndPrint|SideLabel" css={styles.inputLabel}>
          {props.t('Side:')}
        </label>
        <p css={styles.data} data-testid="PreviewAndPrint|Side">
          {(props.sideDetails?.requestStatus === 'SUCCESS' &&
            claimInformation.side &&
            (props.sideDetails.options.find(
              (side) => side.id === claimInformation.side
              // $FlowFixMe[incompatible-use]
            )?.name ??
              '')) ||
            '-'}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label
          data-testid="PreviewAndPrint|BodyAreaLabel"
          css={styles.inputLabel}
        >
          {props.t('Body area:')}
        </label>
        <p css={styles.data} data-testid="PreviewAndPrint|BodyArea">
          {(props.sideDetails?.requestStatus === 'SUCCESS' &&
            claimInformation.bodyArea &&
            (props.bodyAreaDetails.options.find(
              (bodyArea) => bodyArea.id === claimInformation.bodyArea
              // $FlowFixMe[incompatible-use]
            )?.name ??
              '')) ||
            '-'}
        </p>
      </div>

      <hr css={styles.lineDivider} />

      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t('Party')}
      </h5>
      <div css={styles.dataContainer}>
        <label
          data-testid="PreviewAndPrint|FirstNameLabel"
          css={handleValidationCSS(additionalInformation.firstName)}
        >
          {props.t('First name:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|FirstName">
          {additionalInformation.firstName || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label
          data-testid="PreviewAndPrint|LastNameLabel"
          css={handleValidationCSS(additionalInformation.lastName)}
        >
          {props.t('Last name:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|LastName">
          {additionalInformation.lastName || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label css={styles.inputLabel}>{props.t('Date of birth:')}</label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|DateOfBirth">
          {additionalInformation.dateOfBirth || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label css={styles.inputLabel}>
          {props.t('Social security number:')}
        </label>
        <p
          css={getDataCSS()}
          data-testid="PreviewAndPrint|SocialSecurityNumber"
        >
          {additionalInformation.socialSecurityNumber
            ? // sanity check incase we recieve more than last 4 digits and the incorrect type
              `xxx-xx-${additionalInformation.socialSecurityNumber
                .toString()
                .substring(
                  additionalInformation.socialSecurityNumber.toString().length -
                    4
                )}`
            : '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label css={styles.inputLabel}>{props.t('Roster position:')}</label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|Position">
          {additionalInformation.position || missingValuePlaceholder}
        </p>
      </div>

      <hr css={styles.lineDivider} />

      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t('Address')}
      </h5>
      <div css={styles.dataContainer}>
        <label
          data-testid="PreviewAndPrint|Address1Label"
          css={handleValidationCSS(additionalInformation.address1)}
        >
          {props.t('Address 1:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|Address1">
          {additionalInformation.address1 || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label css={styles.inputLabel}>{props.t('Address 2:')}</label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|Address2">
          {additionalInformation.address2 || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label
          data-testid="PreviewAndPrint|CityLabel"
          css={handleValidationCSS(additionalInformation.city)}
        >
          {props.t('City:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|City">
          {additionalInformation.city || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainerSplitTwo}>
        <label
          data-testid="PreviewAndPrint|StateLabel"
          css={handleValidationCSS(additionalInformation.state)}
        >
          {props.t('State:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|State">
          {additionalInformation.state || missingValuePlaceholder}
        </p>
      </div>

      <div css={styles.dataContainerSplitThree}>
        <label
          data-testid="PreviewAndPrint|ZipcodeLabel"
          css={
            additionalInformation.zipCode?.length === 5
              ? styles.inputLabel
              : styles.isInvalid
          }
        >
          {props.t('Zipcode:')}
        </label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|Zipcode">
          {additionalInformation.zipCode || missingValuePlaceholder}
        </p>
      </div>

      <hr css={styles.lineDivider} />

      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t('Phone')}
      </h5>
      <div css={styles.dataContainer}>
        <label css={styles.inputLabel}>{props.t('Phone number:')}</label>
        <p css={getDataCSS()} data-testid="PreviewAndPrint|PhoneNumber">
          {additionalInformation.phoneNumber || missingValuePlaceholder}
        </p>
      </div>
    </div>
  );
};

export const PreviewAndPrintTranslated = withNamespaces()(PreviewAndPrint);
export default PreviewAndPrint;
