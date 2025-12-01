// @flow
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import {
  SlidingPanelResponsive,
  ProgressTracker,
  TextButton,
  AppStatus,
} from '@kitman/components';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { saveDraftOshaForm } from '@kitman/services/src/services/medical/saveDraftOshaForm';
import moment from 'moment';
import type { SelectOption as Option } from '@kitman/components/src/types';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { formatShort } from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../contexts/IssueContext';
import { InitialInformationTranslated as InitialInformation } from './InitialInformation';
import { EmployeeDrInformationTranslated as EmployeeDrInformation } from './EmployeeDrInformation';
import {
  goToNextOshaPanelPage,
  goToPreviousOshaPanelPage,
  updateOshaCaseInformation,
  updateOshaInitialInformation,
  updateOshaEmployeeDrInformation,
  printOshaFormFromSidePanel,
} from '../../redux/actions';
import { getPathologyTitle, getAmericanStateOptions } from '../../utils';

import styles from './styles';
import CaseInformation from './CaseInformation';
import PrintPreview from './PrintPreview';
import useCurrentUser from '../../hooks/useGetCurrentUser';

type Props = {
  athleteData: AthleteData,
  isOpen: boolean,
  staffUsers: Array<Option>,
  onClose: Function,
};

const AddOshaFormSidePanel = (props: I18nProps<Props>) => {
  const { issue, issueType, updateIssue, isChronicIssue } = useIssue();
  const { currentUser, fetchCurrentUser } = useCurrentUser();
  const { organisation } = useOrganisation();
  const dispatch = useDispatch();
  const [saveDraftRequestStatus, setSaveDraftRequestStatus] = useState(null);

  const currentPage = useSelector((state) => state.addOshaFormSidePanel.page);
  const showPrintPreview = useSelector(
    (state) => state.addOshaFormSidePanel.showPrintPreview.sidePanel
  );
  const initialInformation = useSelector(
    (state) => state.addOshaFormSidePanel.initialInformation
  );
  const employeeDrInformation = useSelector(
    (state) => state.addOshaFormSidePanel.employeeDrInformation
  );
  const caseInformation = useSelector(
    (state) => state.addOshaFormSidePanel.caseInformation
  );

  const renderPanelContent = () => {
    switch (currentPage) {
      case 1:
        return <InitialInformation {...props} staffUsers={props.staffUsers} />;
      case 2:
        return <EmployeeDrInformation {...props} />;
      case 3:
        return <CaseInformation {...props} />;
      default:
        return <PrintPreview {...props} issue={issue} />;
    }
  };

  const getIssueDescriptionDefaultValue = () => {
    if (!issue.osha?.issue_description) {
      if (isChronicIssue) {
        // TODO, remove this when we have a typesafe
        // way of supporting IssueOccurrenceRequested & ChronicIssueRequested
        // $FlowFixMe
        return issue.title || issue.full_pathology;
      }

      return getPathologyTitle(issue);
    }
    return issue.osha?.issue_description;
  };

  const handleAfterPrint = () => {
    if (showPrintPreview) {
      dispatch(printOshaFormFromSidePanel(false));
    }
  };

  useEffect(() => {
    if (showPrintPreview) {
      window.print();
    }
  }, [props.isOpen, showPrintPreview]);

  useEffect(() => {
    window.addEventListener('afterprint', handleAfterPrint());

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint());
    };
  }, [showPrintPreview, handleAfterPrint]);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const getReporterObject = () => {
    const userExists =
      props.staffUsers.filter(
        (staffUser) => staffUser.value === currentUser?.id
      ).length > 0;

    if (currentUser && userExists) {
      return {
        value:
          (issue?.osha?.reporter_full_name && // Find staff id from label if issue exists
            props.staffUsers.find(
              (staffMember) =>
                staffMember.label === issue?.osha?.reporter_full_name
            )?.value) ||
          currentUser.id,
        label: issue?.osha?.reporter_full_name || currentUser.fullname,
      };
    }
    return { value: null, label: null };
  };

  const getOshaTitle = () => {
    let oshaTitle = props.t('OSHA');
    if (getPathologyTitle(issue)) {
      oshaTitle = `${oshaTitle} - ${getPathologyTitle(issue)}`;
    }
    if (issue?.occurrence_date) {
      oshaTitle = `${oshaTitle} - ${formatShort(
        moment(issue.occurrence_date)
      )}`;
    }
    return oshaTitle;
  };

  const constructStreetString = () => {
    let streetString = '';

    if (organisation.address) {
      streetString = organisation.address?.line1
        ? organisation.address.line1
        : streetString;
      streetString = organisation.address?.line2
        ? `${streetString}, ${organisation.address.line2}`
        : streetString;
      streetString = organisation.address?.line3
        ? `${streetString}, ${organisation.address.line3}`
        : streetString;

      return streetString;
    }
    return null;
  };

  // Initalise store
  useEffect(() => {
    if (props.isOpen) {
      const initialInformationValues = {
        reporter: getReporterObject(),
        reporterPhoneNumber: issue.osha?.reporter_phone_number || null,
        title: issue.osha?.title || getOshaTitle(),
        issueDate:
          issue.osha?.issue_date ||
          moment().format(DateFormatter.dateTransferFormat), // use current date as default
      };
      const employeeDrInformationValues = {
        fullName:
          issue.osha?.full_name ||
          `${props.athleteData?.firstname} ${props.athleteData?.lastname}` ||
          null,
        street: issue.osha?.street || constructStreetString(),
        city: issue.osha?.city || organisation.address?.city || null,
        state:
          issue.osha?.state ||
          getAmericanStateOptions().find(
            (state) => state.label === organisation.address?.state
          )?.value || // state comes in as 2 letter code
          null,
        zip: issue.osha?.zip || organisation.address?.zipcode || null,
        sex: issue.osha?.sex || 'M',
        dateOfBirth:
          issue.osha?.dob || props.athleteData?.date_of_birth || null,
        dateHired: issue.osha?.date_hired || null,
        physicianFullName: issue.osha?.physician_full_name || null,
        facilityName: issue.osha?.facility_name || null,
        facilityStreet: issue.osha?.facility_street || null,
        facilityCity: issue.osha?.facility_city || null,
        facilityState: issue.osha?.facility_state || null,
        facilityZip: issue.osha?.facility_zip || null,
        emergencyRoom: issue.osha?.emergency_room || false,
        hospitalized: issue.osha?.hospitalized || false,
      };
      const caseInformationValues = {
        athleteActivity: issue.osha?.athlete_activity || null,
        caseNumber: issue.osha?.case_number || null,
        dateInjured: issue.occurrence_date || null,
        dateOfDeath: issue.osha?.date_of_death || null,
        issueDescription:
          issue.osha?.issue_description || getIssueDescriptionDefaultValue(),
        objectSubstance: issue.osha?.object_substance || null,
        timeBeganWork:
          (issue.osha?.time_began_work &&
            moment(issue.osha?.time_began_work, 'HH:mm').format(
              DateFormatter.dateTransferFormat
            )) ||
          null,
        noTimeEvent: caseInformation.noTimeEvent || false,
        timeEvent:
          (issue.osha?.time_event &&
            moment(issue.osha?.time_event, 'HH:mm').format(
              DateFormatter.dateTransferFormat
            )) ||
          null,
        whatHappened: issue.osha?.what_happened || null,
      };

      dispatch(updateOshaInitialInformation(initialInformationValues));
      dispatch(updateOshaEmployeeDrInformation(employeeDrInformationValues));
      dispatch(updateOshaCaseInformation(caseInformationValues));
    }
  }, [props.isOpen, currentUser, props.staffUsers]);

  const formState = {
    athlete_activity: caseInformation.athleteActivity,
    athlete_id: props.athleteData.id,
    case_number: caseInformation.caseNumber,
    city: employeeDrInformation.city,
    date_hired: employeeDrInformation.dateHired,
    dob: employeeDrInformation.dateOfBirth,
    date_of_death: caseInformation.dateOfDeath,
    emergency_room: employeeDrInformation.emergencyRoom,
    facility_city: employeeDrInformation.facilityCity,
    facility_name: employeeDrInformation.facilityName,
    facility_state: employeeDrInformation.facilityState,
    facility_street: employeeDrInformation.facilityStreet,
    facility_zip: employeeDrInformation.facilityZip,
    full_name: props.athleteData.fullname || null,
    hospitalized: employeeDrInformation.hospitalized,
    issue_date: initialInformation.issueDate,
    issue_description: caseInformation.issueDescription,
    issue_id: issue.id,
    issue_type: issueType.toLowerCase(),
    object_substance: caseInformation.objectSubstance,
    physician_full_name: employeeDrInformation.physicianFullName,
    reporter_full_name: initialInformation.reporter?.label,
    reporter_phone_number: initialInformation.reporterPhoneNumber,
    sex: employeeDrInformation.sex,
    state: employeeDrInformation.state,
    street: employeeDrInformation.street,
    time_began_work:
      caseInformation.timeBeganWork &&
      moment(caseInformation.timeBeganWork).format('HH:mm'),
    time_event: caseInformation.noTimeEvent
      ? null
      : caseInformation.timeEvent &&
        moment(caseInformation.timeEvent).format('HH:mm'),
    title: initialInformation.title,
    what_happened: caseInformation.whatHappened,
    zip: employeeDrInformation.zip,
  };

  return (
    <div data-testid="AddOshaFormSidePanel__container">
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={props.t('OSHA’s Form 301 - Injury and Illness Incident Report')}
        onClose={props.onClose}
        width={659}
      >
        <div
          css={styles.container}
          data-testid="AddOshaFormSidePanel|ProgressBar"
        >
          <ProgressTracker
            currentHeadingId={currentPage}
            headings={[
              { id: 1, name: props.t('Initial information') },
              { id: 2, name: props.t('Employee and doctor information') },
              { id: 3, name: props.t('Information about the case') },
              { id: 4, name: props.t('Print and preview') },
            ]}
          />
        </div>

        {currentPage !== 4 && (
          <div css={styles.attentionDialog}>
            <p>
              <span>{props.t('Attention: ')}</span>
              {props.t(
                'This form contains information relating to employee health and must be used in a manner that protects the confidentiality of employees to the extent possible while the information is being used for occupational safety and health purposes.'
              )}
            </p>
          </div>
        )}

        {renderPanelContent()}

        <div css={styles.navigationButtonsContainer}>
          {currentPage !== 1 && (
            <div
              data-testid="AddOshaFormSidePanel|BackButton"
              css={styles.backButton}
            >
              <TextButton
                text={props.t('Back')}
                type="secondary"
                kitmanDesignSystem
                onClick={() => dispatch(goToPreviousOshaPanelPage())}
              />
            </div>
          )}

          {currentPage !== 4 ? (
            <div data-testid="AddOshaFormSidePanel|SaveProgressButton">
              <TextButton
                text={props.t('Save progress')}
                type="textOnly"
                onClick={() => {
                  setSaveDraftRequestStatus('PENDING');
                  saveDraftOshaForm(formState)
                    .then((data) => {
                      setSaveDraftRequestStatus('SUCCESS');
                      props.onClose();
                      updateIssue({ ...issue, osha: data });
                    })
                    .catch((err) => {
                      setSaveDraftRequestStatus('FAILURE');
                      console.error(err.responseText);
                    });
                }}
                kitmanDesignSystem
              />
            </div>
          ) : (
            <div data-testid="AddOshaFormSidePanel|PrintButton">
              <TextButton
                text={props.t('Print')}
                type="textOnly"
                kitmanDesignSystem
                onClick={() => {
                  setSaveDraftRequestStatus('PENDING');
                  saveDraftOshaForm(formState)
                    .then((data) => {
                      setSaveDraftRequestStatus('SUCCESS');
                      props.onClose();
                      updateIssue({ ...issue, osha: data });
                    })
                    .catch((err) => {
                      setSaveDraftRequestStatus('FAILURE');
                      console.error(err.responseText);
                    })
                    .finally(() => {
                      dispatch(printOshaFormFromSidePanel(true));
                    });
                }}
              />
            </div>
          )}

          {currentPage !== 4 ? (
            <div data-testid="AddOshaFormSidePanel|NextButton">
              <TextButton
                text={props.t('Next')}
                type="primary"
                kitmanDesignSystem
                onClick={() => dispatch(goToNextOshaPanelPage())}
              />
            </div>
          ) : (
            <div data-testid="AddOshaFormSidePanel|SaveButton">
              <TextButton
                text={props.t('Save')}
                type="primary"
                kitmanDesignSystem
                onClick={() => {
                  setSaveDraftRequestStatus('PENDING');
                  saveDraftOshaForm(formState)
                    .then((data) => {
                      setSaveDraftRequestStatus('SUCCESS');
                      props.onClose();
                      updateIssue({ ...issue, osha: data });
                    })
                    .catch((err) => {
                      setSaveDraftRequestStatus('FAILURE');
                      console.error(err.responseText);
                    });
                }}
              />
            </div>
          )}
        </div>

        {saveDraftRequestStatus && saveDraftRequestStatus !== 'SUCCESS' && (
          <AppStatus
            status={saveDraftRequestStatus === 'FAILURE' ? 'error' : 'loading'}
          />
        )}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddOshaFormSidePanelTranslated =
  withNamespaces()(AddOshaFormSidePanel);
export default AddOshaFormSidePanel;
