// @flow
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { Select, InputTextField, DatePicker } from '@kitman/components';
import { useDispatch, useSelector } from 'react-redux';
import type { SelectOption as Option } from '@kitman/components/src/types';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import styles from './styles';
import { updateClaimInformationField } from '../../../redux/actions';
import { getAmericanStateOptions } from '../../../utils';
import type { IssueOccurrenceRequested } from '../../../../../../../common/src/types/Issues';
import type { Sides } from '../../../../../../../services/src/services/medical/getSides';
import type { BodyAreas } from '../../../../../../../services/src/services/medical/clinicalImpressions';

type Props = {
  staffUsers: Array<Option>,
  issue: {
    ...IssueOccurrenceRequested,
    title: string,
    full_pathology: string,
  },
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

const ClaimInformation = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const claimInformation = useSelector(
    (state) => state.addWorkersCompSidePanel.claimInformation
  );

  return (
    <div css={styles.content} data-testid="ClaimInformation">
      <div
        css={styles.firstHalfContainer}
        data-testid="AddWorkersCompSidePanel|PersonName"
      >
        <Select
          label={props.t('Reported person name')}
          onChange={(staffUser) => {
            dispatch(updateClaimInformationField('personName', staffUser));
          }}
          value={claimInformation.personName?.value}
          options={props.staffUsers}
          returnObject
        />
      </div>

      <div
        css={styles.firstHalfContainer}
        data-testid="AddWorkersCompSidePanel|ContactNumber"
      >
        <InputTextField
          value={claimInformation.contactNumber}
          label={props.t('Reported person contact phone')}
          optional
          kitmanDesignSystem
          onChange={(event) =>
            dispatch(
              updateClaimInformationField('contactNumber', event.target.value)
            )
          }
        />
      </div>

      <div
        css={styles.secondHalfContainer}
        data-testid="AddWorkersCompSidePanel|PolicyNumber"
      >
        <InputTextField
          value={claimInformation.policyNumber}
          label={props.t('Policy number')}
          required={props.isPolicyNumberRequired}
          optional={!props.isPolicyNumberRequired}
          kitmanDesignSystem
          onChange={(event) =>
            dispatch(
              updateClaimInformationField('policyNumber', event.target.value)
            )
          }
        />
      </div>

      <hr css={styles.lineDivider} />

      <div
        css={styles.firstHalfContainer}
        data-testid="AddWorkersCompSidePanel|LossDate"
      >
        <DatePicker
          label={props.t('Loss date')}
          name="wokers_comp_loss_date"
          value={claimInformation.lossDate}
          kitmanDesignSystem
          onDateChange={(value) => {
            dispatch(
              updateClaimInformationField(
                'lossDate',
                moment(value).format(DateFormatter.dateTransferFormat)
              )
            );
          }}
        />
      </div>

      <div
        css={styles.firstHalfContainer}
        data-testid="AddWorkersCompSidePanel|LossCity"
      >
        <InputTextField
          value={claimInformation.lossCity}
          label={props.t('Loss city')}
          required
          kitmanDesignSystem
          onChange={(event) =>
            dispatch(
              updateClaimInformationField('lossCity', event.target.value)
            )
          }
        />
      </div>

      <div data-testid="AddWorkersCompSidePanel|LossState">
        <Select
          label={props.t('Loss state')}
          onChange={(state) =>
            dispatch(updateClaimInformationField('lossState', state))
          }
          value={claimInformation.lossState}
          options={getAmericanStateOptions()}
        />
      </div>

      <div data-testid="AddWorkersCompSidePanel|LossJurisdiction">
        <InputTextField
          value={claimInformation.lossJurisdiction}
          label={props.t('Loss jurisdiction')}
          optional
          kitmanDesignSystem
          onChange={(event) =>
            dispatch(
              updateClaimInformationField(
                'lossJurisdiction',
                event.target.value
              )
            )
          }
        />
      </div>

      <div
        css={styles.fullWidthContainer}
        data-testid="AddWorkersCompSidePanel|LossDescription"
      >
        <InputTextField
          value={claimInformation.lossDescription}
          label={props.t('Loss description')}
          required
          kitmanDesignSystem
          onChange={(event) =>
            dispatch(
              updateClaimInformationField('lossDescription', event.target.value)
            )
          }
        />
      </div>

      <div
        css={styles.firstHalfContainer}
        data-testid="AddWorkersCompSidePanel|Side"
      >
        <Select
          label={props.t('Side')}
          onChange={(side) => {
            dispatch(updateClaimInformationField('side', side.value));
          }}
          value={claimInformation.side}
          options={props.sideDetails.options.map((side) => {
            return { value: side.id, label: side.name };
          })}
          returnObject
          isDisabled={props.sideDetails.requestStatus === 'FAILURE'}
          isLoading={props.sideDetails.requestStatus === 'PENDING'}
          optional
        />
      </div>

      <div
        css={styles.secondHalfContainer}
        data-testid="AddWorkersCompSidePanel|BodyArea"
      >
        <Select
          label={props.t('Body area')}
          onChange={(bodyArea) => {
            dispatch(updateClaimInformationField('bodyArea', bodyArea.value));
          }}
          value={claimInformation.bodyArea}
          options={props.bodyAreaDetails.options.map((bodyArea) => {
            return { value: bodyArea.id, label: bodyArea.name };
          })}
          returnObject
          isDisabled={props.bodyAreaDetails.requestStatus !== 'SUCCESS'}
          isLoading={props.bodyAreaDetails.requestStatus === 'PENDING'}
          optional
        />
      </div>
    </div>
  );
};

export const ClaimInformationTranslated = withNamespaces()(ClaimInformation);
export default ClaimInformation;
