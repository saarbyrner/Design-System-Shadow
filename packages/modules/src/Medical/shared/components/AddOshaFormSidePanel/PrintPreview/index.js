// @flow
import { useSelector } from 'react-redux';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getPathologyTitle } from '../../../utils';
import EllipsisTooltipText from '../../../../../../../components/src/EllipsisTooltipText';
import type { IssueOccurrenceRequested } from '../../../../../../../common/src/types/Issues';
import styles from './styles';

type Props = {
  issue: IssueOccurrenceRequested,
};

const PrintPreview = (props: I18nProps<Props>) => {
  const initialInformation = useSelector(
    (state) => state.addOshaFormSidePanel.initialInformation
  );
  const employeeDrInformation = useSelector(
    (state) => state.addOshaFormSidePanel.employeeDrInformation
  );
  const caseInformation = useSelector(
    (state) => state.addOshaFormSidePanel.caseInformation
  );

  return (
    <div data-testid="PrintPreview" css={styles.content}>
      <h3
        css={styles.header}
        className="kitmanHeading--L2"
        data-testid="PrintPreview|OshaTitle"
      >
        OSHA
        {getPathologyTitle(props.issue) && (
          <>
            {' - '}
            <EllipsisTooltipText
              content={getPathologyTitle(props.issue)}
              displayEllipsisWidth={400}
            />
          </>
        )}
        {caseInformation.dateInjured && (
          <>
            {' - '}
            {DateFormatter.formatShort(moment(caseInformation.dateInjured))}
          </>
        )}
      </h3>

      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t('Initial information')}
      </h5>
      <div css={styles.dataContainer}>
        <label data-testid="PrintPreview|CompletedByLabel">
          {props.t('Completed by:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|CompletedBy">
          {initialInformation.reporter?.label || '-'}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label data-testid="PrintPreview|TitleLabel">{props.t('Title:')}</label>
        <p css={styles.data} data-testid="PrintPreview|Title">
          {initialInformation.title || '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label css={styles.inputLabel}>
          {props.t('Reported person contact phone:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|ReporterPhoneNumber">
          {initialInformation.reporterPhoneNumber || '-'}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label data-testid="PrintPreview|IssueDateLabel">
          {props.t('Date:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|IssueDate">
          {initialInformation.issueDate
            ? DateFormatter.formatStandard({
                date: moment(initialInformation.issueDate),
                showTime: false,
                showCompleteDate: false,
                displayLongDate: false,
              })
            : '-'}
        </p>
      </div>

      <hr css={styles.lineDivider} />

      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t('Information about the employee')}
      </h5>

      <div css={styles.dataContainer}>
        <label data-testid="PrintPreview|FullNameLabel">
          {props.t('Full name:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|FullName">
          {employeeDrInformation.fullName || '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label data-testid="PrintPreview|StreetLabel">
          {props.t('Street:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|Street">
          {employeeDrInformation.street || '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label data-testid="PrintPreview|CityLabel">{props.t('City:')}</label>
        <p css={styles.data} data-testid="PrintPreview|City">
          {employeeDrInformation.city || '-'}
        </p>
      </div>

      <div css={styles.dataContainerSplitTwo}>
        <label data-testid="PrintPreview|StateLabel">{props.t('State:')}</label>
        <p css={styles.data} data-testid="PrintPreview|State">
          {employeeDrInformation.state || '-'}
        </p>
      </div>

      <div css={styles.dataContainerSplitThree}>
        <label data-testid="PrintPreview|ZipLabel">{props.t('Zipcode:')}</label>
        <p css={styles.data} data-testid="PrintPreview|Zip">
          {employeeDrInformation.zip || '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label data-testid="PrintPreview|DateOfBirthLabel">
          {props.t('Date of birth:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|DateOfBirth">
          {employeeDrInformation.dateOfBirth
            ? DateFormatter.formatStandard({
                date: moment(employeeDrInformation.dateOfBirth),
                showTime: false,
                showCompleteDate: false,
                displayLongDate: false,
              })
            : '-'}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label data-testid="PrintPreview|DateHiredLabel">
          {props.t('Date hired:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|DateHired">
          {employeeDrInformation.dateHired
            ? DateFormatter.formatStandard({
                date: moment(employeeDrInformation.dateHired),
                showTime: false,
                showCompleteDate: false,
                displayLongDate: false,
              })
            : '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label data-testid="PrintPreview|SexLabel">{props.t('Sex:')}</label>
        <p css={styles.data} data-testid="PrintPreview|Sex">
          {(employeeDrInformation.sex === 'M' && props.t('Male')) ||
            (employeeDrInformation.sex === 'F' && props.t('Female')) ||
            '-'}
        </p>
      </div>

      <hr css={styles.lineDivider} />

      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t(
          'Information about the physician or other health care professional'
        )}
      </h5>

      <div css={styles.dataContainerFull}>
        <label data-testid="PrintPreview|PhysicianFullNameLabel">
          {props.t('Name of physician or other health care professional:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|PhysicianFullName">
          {employeeDrInformation.physicianFullName || '-'}
        </p>
      </div>

      <div css={styles.questionHeader}>
        {props.t(
          'If treatment was given away from the worksite, where was it given?'
        )}
      </div>

      <div css={styles.dataContainerFull}>
        <label data-testid="PrintPreview|FacilityNameLabel">
          {props.t('Facility:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|FacilityName">
          {employeeDrInformation.facilityName || '-'}
        </p>
      </div>

      <div css={styles.dataContainerFull}>
        <label data-testid="PrintPreview|FacilityStreetLabel">
          {props.t('Facility street:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|FacilityStreet">
          {employeeDrInformation.facilityStreet || '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label data-testid="PrintPreview|FacilityCityLabel">
          {props.t('Facility city:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|FacilityCity">
          {employeeDrInformation.facilityCity || '-'}
        </p>
      </div>

      <div css={styles.dataContainerSplitTwo}>
        <label data-testid="PrintPreview|FacilityStateLabel">
          {props.t('Facility state:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|FacilityState">
          {employeeDrInformation.facilityState || '-'}
        </p>
      </div>

      <div css={styles.dataContainerSplitThree}>
        <label data-testid="PrintPreview|FacilityZipLabel">
          {props.t('Facility zipcode:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|FacilityZip">
          {employeeDrInformation.facilityZip || '-'}
        </p>
      </div>

      <div css={styles.dataContainerFull}>
        <label data-testid="PrintPreview|EmergencyRoomLabel">
          {props.t('Was employee treated in an emergency room?')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|EmergencyRoom">
          {employeeDrInformation.emergencyRoom?.toString() || '-'}
        </p>
      </div>

      <div css={styles.dataContainerFull}>
        <label data-testid="PrintPreview|HospitalizedLabel">
          {props.t('Was employee hospitalized overnight as an in-patient?')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|Hospitalized">
          {employeeDrInformation.hospitalized?.toString() || '-'}
        </p>
      </div>

      <hr css={styles.lineDivider} />

      <h5 css={styles.header} className="kitmanHeading--L4">
        {props.t('Information about the case')}
      </h5>

      <div css={styles.dataContainerFull}>
        <label data-testid="PrintPreview|CaseNumberLabel">
          {props.t('Case number from the Log:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|CaseNumber">
          {caseInformation.caseNumber || '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label data-testid="PrintPreview|DateInjuredLabel">
          {props.t('Date of injury or illness:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|DateInjured">
          {caseInformation.dateInjured
            ? DateFormatter.formatStandard({
                date: moment(caseInformation.dateInjured),
                showTime: false,
                showCompleteDate: false,
                displayLongDate: false,
              })
            : '-'}
        </p>
      </div>

      <div css={styles.dataContainerSplit}>
        <label data-testid="PrintPreview|TimeBeganWorkLabel">
          {props.t('Time employee began work:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|TimeBeganWork">
          {caseInformation.timeBeganWork
            ? DateFormatter.formatJustTime(
                moment(caseInformation.timeBeganWork)
              )
            : '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label data-testid="PrintPreview|TimeEventLabel">
          {props.t('Time of event:')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|TimeEvent">
          {(caseInformation.noTimeEvent &&
            props.t('Time of event could not be determined')) ||
            (caseInformation.timeEvent &&
              DateFormatter.formatJustTime(
                moment(caseInformation.timeEvent)
              )) ||
            '-'}
        </p>
      </div>

      <div css={styles.dataContainerFull}>
        <label data-testid="PrintPreview|AthleteActivityLabel">
          {props.t(
            'What was the employee doing just before the incident occured? '
          )}
        </label>
        <p css={styles.data} data-testid="PrintPreview|AthleteActivity">
          {caseInformation.athleteActivity || '-'}
        </p>
      </div>

      <div css={styles.dataContainerFull}>
        <label data-testid="PrintPreview|WhatHappenedLabel">
          {props.t('What happened? ')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|WhatHappened">
          {caseInformation.whatHappened || '-'}
        </p>
      </div>

      <div css={styles.dataContainerFull}>
        <label data-testid="PrintPreview|IssueDescriptionLabel">
          {props.t('What was the injury or illness? ')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|IssueDescription">
          {caseInformation.issueDescription || '-'}
        </p>
      </div>

      <div css={styles.dataContainerFull}>
        <label data-testid="PrintPreview|ObjectSubstanceLabel">
          {props.t('What object or substance directly harmed the employee? ')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|ObjectSubstance">
          {caseInformation.objectSubstance || '-'}
        </p>
      </div>

      <div css={styles.dataContainer}>
        <label data-testid="PrintPreview|DateOfDeathLabel">
          {props.t('If the employee died, when did death occur? ')}
        </label>
        <p css={styles.data} data-testid="PrintPreview|DateOfDeath">
          {caseInformation.dateOfDeath
            ? DateFormatter.formatStandard({
                date: moment(caseInformation.dateOfDeath),
                showTime: false,
                showCompleteDate: false,
                displayLongDate: false,
              })
            : '-'}
        </p>
      </div>
    </div>
  );
};

export const PrintPreviewTranslated = withNamespaces()(PrintPreview);
export default PrintPreview;
