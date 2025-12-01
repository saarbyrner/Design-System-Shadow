// @flow
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  DatePicker,
  InputTextField,
  RadioList,
  Select,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { updateEmployeeDrInformationField } from '../../../redux/actions';
import styles from './styles';
import { getAmericanStateOptions } from '../../../utils';

type Props = {};

const EmployeeDrInformation = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const employeeDrInformation = useSelector(
    (state) => state.addOshaFormSidePanel.employeeDrInformation
  );

  return (
    <div data-testid="EmployeeDrInformation" css={styles.content}>
      <div css={styles.initialForm}>
        <div css={styles.sectionTitle}>
          {props.t('Information about the employee')}
        </div>

        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|FullName"
        >
          <InputTextField
            value={employeeDrInformation.fullName}
            label={props.t('Full Name')}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateEmployeeDrInformationField('fullName', event.target.value)
              );
            }}
          />
        </div>
        <div css={styles.streetContainer} data-testid="AddOshaSidePanel|Street">
          <InputTextField
            value={employeeDrInformation.street}
            label={props.t('Street')}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateEmployeeDrInformationField('street', event.target.value)
              );
            }}
          />
        </div>

        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|City"
        >
          <InputTextField
            value={employeeDrInformation.city}
            label={props.t('City')}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateEmployeeDrInformationField('city', event.target.value)
              );
            }}
          />
        </div>
        <div css={styles.stateContainer} data-testid="AddOshaSidePanel|State">
          <Select
            value={employeeDrInformation.state}
            label={props.t('State')}
            kitmanDesignSystem
            onChange={(state) => {
              dispatch(updateEmployeeDrInformationField('state', state));
            }}
            options={getAmericanStateOptions()}
          />
        </div>
        <div css={styles.zipContainer} data-testid="AddOshaSidePanel|Zip">
          <InputTextField
            value={employeeDrInformation.zip}
            label={props.t('Zip code')}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateEmployeeDrInformationField(
                  'zip',
                  event.target.value.slice(0, 5)
                )
              );
            }}
          />
        </div>
        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|DateOfBirth"
        >
          <label css={styles.inputLabel}>{props.t('Date of birth')}</label>
          <p>{employeeDrInformation.dateOfBirth || '-'}</p>
        </div>
        <div
          css={styles.rightColumnContainer}
          data-testid="AddOshaSidePanel|DateHired"
        >
          <DatePicker
            value={employeeDrInformation.dateHired || null}
            label={props.t('Date hired')}
            name="dr_date_hired"
            kitmanDesignSystem
            onDateChange={(value) => {
              dispatch(
                updateEmployeeDrInformationField(
                  'dateHired',
                  moment(value).format(DateFormatter.dateTransferFormat)
                )
              );
            }}
          />
        </div>
        <RadioList
          label={props.t('Sex')}
          direction="vertical"
          options={[
            {
              name: props.t('Male'),
              value: props.t('M'),
            },
            {
              name: props.t('Female'),
              value: props.t('F'),
            },
          ]}
          change={(value) => {
            dispatch(updateEmployeeDrInformationField('sex', value));
          }}
          radioName={props.t('sex')}
          value={employeeDrInformation.sex}
          kitmanDesignSystem
        />

        <hr css={styles.lineDivider} />

        <div css={styles.sectionTitle}>
          {props.t(
            'Information about the physician or other health care professional'
          )}
        </div>

        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|PhysicianFullName"
        >
          <InputTextField
            value={employeeDrInformation.physicianFullName}
            label={props.t(
              'Name of physician or other health care professional'
            )}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateEmployeeDrInformationField(
                  'physicianFullName',
                  event.target.value
                )
              );
            }}
          />
        </div>
        <p css={styles.infoText}>
          {props.t(
            'If treatment was given away from the worksite, where was it given?'
          )}
        </p>
        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|FacilityName"
        >
          <InputTextField
            value={employeeDrInformation.facilityName}
            label={props.t('Facility')}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateEmployeeDrInformationField(
                  'facilityName',
                  event.target.value
                )
              );
            }}
          />
        </div>
        <div
          css={styles.streetContainer}
          data-testid="AddOshaSidePanel|FacilityStreet"
        >
          <InputTextField
            value={employeeDrInformation.facilityStreet}
            label={props.t('Street')}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateEmployeeDrInformationField(
                  'facilityStreet',
                  event.target.value
                )
              );
            }}
          />
        </div>

        <div
          css={styles.leftColumnContainer}
          data-testid="AddOshaSidePanel|FacilityCity"
        >
          <InputTextField
            value={employeeDrInformation.facilityCity}
            label={props.t('City')}
            kitmanDesignSystem
            onChange={(event) => {
              dispatch(
                updateEmployeeDrInformationField(
                  'facilityCity',
                  event.target.value
                )
              );
            }}
          />
        </div>
        <div
          css={styles.stateContainer}
          data-testid="AddOshaSidePanel|FacilityState"
        >
          <Select
            value={employeeDrInformation.facilityState}
            label={props.t('State')}
            kitmanDesignSystem
            onChange={(state) => {
              dispatch(
                updateEmployeeDrInformationField('facilityState', state)
              );
            }}
            options={getAmericanStateOptions()}
          />
        </div>
        <div
          css={styles.zipContainer}
          data-testid="AddOshaSidePanel|FacilityZip"
        >
          <InputTextField
            value={employeeDrInformation.facilityZip}
            label={props.t('Zip code')}
            kitmanDesignSystem
            name="facility_zip"
            onChange={(event) => {
              dispatch(
                updateEmployeeDrInformationField(
                  'facilityZip',
                  event.target.value.slice(0, 5)
                )
              );
            }}
          />
        </div>
        <RadioList
          label={props.t('Was employee treated in an emergency room?')}
          direction="vertical"
          options={[
            {
              name: props.t('Yes'),
              value: 1,
            },
            {
              name: props.t('No'),
              value: 0,
            },
          ]}
          change={(value) => {
            const isER = value === '1';
            dispatch(updateEmployeeDrInformationField('emergencyRoom', isER));
          }}
          radioName={props.t('emergency_room')}
          value={!employeeDrInformation.emergencyRoom ? 0 : 1}
          kitmanDesignSystem
        />
        <RadioList
          label={props.t(
            'Was employee hospitalized overnight as an in-patient?'
          )}
          direction="vertical"
          options={[
            {
              name: props.t('Yes'),
              value: 1,
            },
            {
              name: props.t('No'),
              value: 0,
            },
          ]}
          change={(value) => {
            const isHospitalized = value === '1';
            dispatch(
              updateEmployeeDrInformationField('hospitalized', isHospitalized)
            );
          }}
          radioName={props.t('hospitalized')}
          value={!employeeDrInformation.hospitalized ? 0 : 1}
          kitmanDesignSystem
        />
      </div>
    </div>
  );
};

export const EmployeeDrInformationTranslated = withNamespaces()(
  EmployeeDrInformation
);
export default EmployeeDrInformation;
