// @flow
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { InputTextField, DatePicker, Select } from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { updateInitialInformationField } from '../../../redux/actions';
import styles from './styles';

type Props = {
  staffUsers: Array<Option>,
};

const InitialInformation = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const initialInformation = useSelector(
    (state) => state.addOshaFormSidePanel.initialInformation
  );

  return (
    <div data-testid="InitialInformation" css={styles.content}>
      <p>
        {props.t(
          'This Injury and Illness Incident Report is one of the first forms you must fill out when a recordable work-related injury or illness has occurred. Together with the Log of Work-Related Injuries and Illnesses and the accompanying Summary, these forms help the employer and OSHA develop a picture of the extent and severity of work-related incidents.'
        )}
      </p>
      <p>
        {props.t(
          'Within 7 calendar days after you receive information that a recordable work-related injury or illness has occurred, you must fill out this form or an equivalent. Some state workers’ compensation, insurance, or other reports may be acceptable substitutes. To be considered an equivalent form, any substitute must contain all the information asked for on this form.'
        )}
      </p>
      <p>
        {props.t(
          'According to Public Law 91-596 and 29 CFR 1904, OSHA’s recordkeeping rule, you must keep this form on file for 5 years following the year to which it pertains.'
        )}
      </p>
      <p>
        {props.t(
          'If you need additional copies of this form, you may photocopy the printout or insert additional form pages in the PDF, and then use as many as you need.'
        )}
      </p>
      <div css={styles.initialForm}>
        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|CompletedBy"
        >
          <Select
            value={initialInformation.reporter?.value}
            label={props.t('Completed by:')}
            options={props.staffUsers}
            returnObject
            onChange={(user) => {
              dispatch(updateInitialInformationField('reporter', user));
            }}
          />
        </div>

        <div
          css={styles.rightColumnContainerOverflowHidden}
          data-testid="AddOshaSidePanel|Title"
        >
          <InputTextField
            value={initialInformation.title}
            label={props.t('Title')}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateInitialInformationField('title', event.target.value)
              );
            }}
          />
        </div>

        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|Phone"
        >
          <InputTextField
            value={initialInformation.reporterPhoneNumber}
            label={props.t('Phone')}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateInitialInformationField(
                  'reporterPhoneNumber',
                  event.target.value
                )
              );
            }}
          />
        </div>

        <div
          css={styles.rightColumnContainer}
          data-testid="AddOshaSidePanel|Date"
        >
          <DatePicker
            value={initialInformation.issueDate}
            label={props.t('Date')}
            name="osha_form_date"
            kitmanDesignSystem
            onDateChange={(value) => {
              dispatch(
                updateInitialInformationField(
                  'issueDate',
                  moment(value).format(DateFormatter.dateTransferFormat)
                )
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const InitialInformationTranslated =
  withNamespaces()(InitialInformation);
export default InitialInformation;
