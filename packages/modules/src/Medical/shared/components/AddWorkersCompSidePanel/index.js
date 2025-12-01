// @flow
import {
  SlidingPanelResponsive,
  ProgressTracker,
  TextButton,
  AppStatus,
} from '@kitman/components';
import {
  saveDraftWorkersComp,
  getClinicalImpressionsBodyAreas,
} from '@kitman/services';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { withNamespaces } from 'react-i18next';
import { useState, useEffect } from 'react';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { useFetchOrganisationPreferenceQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import styles from './styles';
import { useIssue } from '../../contexts/IssueContext';
import { ClaimInformationTranslated as ClaimInformation } from './ClaimInformation';
import { AdditionalInformationTranslated as AdditionalInformation } from './AdditionalInformation';
import { PreviewAndPrintTranslated as PreviewAndPrint } from './PreviewAndPrint';
import { useGetSidesQuery } from '../../redux/services/medical';
import {
  goToNextPanelPage,
  goToPreviousPanelPage,
  closeWorkersCompSidePanel,
  showWorkersCompSubmitModal,
  updateWorkersCompClaimInformation,
  updateWorkersCompAdditionalInformation,
  printWorkersCompFromSidePanel,
} from '../../redux/actions';
import { getPathologyTitle, getAmericanStateOptions } from '../../utils';
import useCurrentUser from '../../hooks/useGetCurrentUser';

type MappedStaffUsers = {
  value: number,
  label: string,
  firstName: string,
  lastName: string,
};

type Props = {
  isOpen: boolean,
  onClose: Function,
  athleteData: AthleteData,
  staffUsers: Array<MappedStaffUsers>,
  staffUsersRequestStatus: string,
};

const AddWorkersCompSidePanel = (props: I18nProps<Props>) => {
  const { issue, issueType, updateIssue, isChronicIssue } = useIssue();
  const { currentUser, fetchCurrentUser } = useCurrentUser();
  const { organisation } = useOrganisation();
  const dispatch = useDispatch();
  const [saveDraftRequestStatus, setSaveDraftRequestStatus] = useState(null);
  const [
    bodyAreaOptionsRequestStatus,
    setClinicalBodyAreaOptionsRequestStatus,
  ] = useState(null);
  const [bodyAreaOptions, setBodyAreaOptions] = useState([]);

  const currentPage = useSelector(
    (state) => state.addWorkersCompSidePanel.page
  );
  const claimInformation = useSelector(
    (state) => state.addWorkersCompSidePanel.claimInformation
  );
  const additionalInformation = useSelector(
    (state) => state.addWorkersCompSidePanel.additionalInformation
  );
  const showPrintPreview = useSelector(
    (state) => state.addWorkersCompSidePanel.showPrintPreview.sidePanel
  );

  const { data: isOptionalWorkersCompClaimPolicyNumber } =
    useFetchOrganisationPreferenceQuery(
      'optional_workers_comp_claim_policy_number'
    );

  const {
    data: sides = [],
    error: getSidesError,
    isLoading: areSidesLoading,
  } = useGetSidesQuery(null, { skip: !props.isOpen });

  const getSidesRequestStatus = () => {
    if (getSidesError) {
      return 'FAILURE';
    }
    if (areSidesLoading) {
      return 'PENDING';
    }
    return 'SUCCESS';
  };

  const hasRequestFailed =
    (saveDraftRequestStatus ||
      props.staffUsersRequestStatus ||
      bodyAreaOptionsRequestStatus ||
      getSidesRequestStatus()) === 'FAILURE';

  const isSubmitted = issue.workers_comp?.status === 'submitted';

  const renderPanelContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <ClaimInformation
            {...props}
            issue={issue}
            athleteId={props.athleteData.id}
            isChronicIssue={isChronicIssue}
            isPolicyNumberRequired={
              !isOptionalWorkersCompClaimPolicyNumber?.value
            }
            sideDetails={{
              options: sides,
              requestStatus: getSidesRequestStatus(),
            }}
            bodyAreaDetails={{
              options: bodyAreaOptions,
              requestStatus: bodyAreaOptionsRequestStatus,
            }}
          />
        );
      case 2:
        return <AdditionalInformation {...props} issue={issue} />;
      default:
        return (
          <PreviewAndPrint
            {...props}
            issue={issue}
            isPolicyNumberRequired={
              !isOptionalWorkersCompClaimPolicyNumber?.value
            }
            sideDetails={{
              options: sides,
              requestStatus: getSidesRequestStatus(),
            }}
            bodyAreaDetails={{
              options: bodyAreaOptions,
              requestStatus: bodyAreaOptionsRequestStatus,
            }}
          />
        );
    }
  };

  const requiredFields = {
    // CLAIM INFO:
    'Reported person name': claimInformation.personName?.value,
    ...(!isOptionalWorkersCompClaimPolicyNumber?.value
      ? { 'Policy number': claimInformation.policyNumber?.length > 0 }
      : {}),
    'Loss city': claimInformation.lossCity?.length > 0,
    'Loss state': claimInformation.lossState?.length > 0,
    'Loss description': claimInformation.lossDescription?.length > 0,

    // PLAYER INFO:
    'First name': additionalInformation.firstName?.length > 0,
    'Last name': additionalInformation.lastName?.length > 0,
    'Social security number must be at least 9 characters long':
      additionalInformation.socialSecurityNumber?.length > 8,
    'Address line 1': additionalInformation.address1?.length > 0,
    City: additionalInformation.city?.length > 0,
    State: additionalInformation.state?.length > 0,
    Zipcode: additionalInformation.zipCode?.length === 5,
  };

  const renderInvalidList = () => {
    return Object.entries(requiredFields).map((requiredFieldPair) => {
      if (!requiredFieldPair[1]) {
        return (
          <div key={requiredFieldPair[0]}>
            <li>{requiredFieldPair[0]}</li>
          </div>
        );
      }
      return null;
    });
  };

  const isRequiredFieldsInvalid = () => {
    const allRequiredFieldsAreValid = Object.values(requiredFields).every(
      (item) => item
    );

    // If the validation fails, return true to disable button (double negative here)
    if (!allRequiredFieldsAreValid) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    fetchCurrentUser();

    setClinicalBodyAreaOptionsRequestStatus('PENDING');

    getClinicalImpressionsBodyAreas()
      .then((data) => {
        setBodyAreaOptions(data);
        setClinicalBodyAreaOptionsRequestStatus('SUCCESS');
      })
      .catch(() => {
        setClinicalBodyAreaOptionsRequestStatus('FAILURE');
      });
  }, []);

  const handleAfterPrint = () => {
    if (showPrintPreview) {
      dispatch(printWorkersCompFromSidePanel(false));
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

  const getLossDescriptionDefaultValue = () => {
    if (!issue.workers_comp?.loss_description) {
      if (isChronicIssue) {
        // TODO, remove this when we have a typesafe
        // way of supporting IssueOccurrenceRequested & ChronicIssueRequested
        // $FlowFixMe
        return issue.title || issue.full_pathology || null;
      }

      return getPathologyTitle(issue);
    }
    return issue.workers_comp?.loss_description;
  };

  const getPersonNameObject = () => {
    const occurenceReporter = issue?.created_by;
    const staffUsernameFromIssue = issue?.workers_comp
      ? `${issue.workers_comp?.reporter_first_name} ${issue.workers_comp?.reporter_last_name}`
      : null;
    const userExists =
      props.staffUsers.filter(
        (staffUser) => staffUser.value === currentUser?.id
      ).length > 0;

    if (currentUser && userExists) {
      return {
        value:
          (issue?.workers_comp && // Find staff id from label if issue exists
            props.staffUsers.find(
              (staffMember) => staffMember.label === staffUsernameFromIssue
            )?.value) ||
          props.staffUsers.find(
            (staffMember) => staffMember.label === occurenceReporter
          )?.value ||
          currentUser.id,
        label:
          staffUsernameFromIssue || occurenceReporter || currentUser.fullname,
        firstName:
          issue.workers_comp?.reporter_first_name ||
          props.staffUsers.find(
            (staffMember) => staffMember.label === occurenceReporter
          )?.firstName ||
          currentUser.firstname,
        lastName:
          issue.workers_comp?.reporter_last_name ||
          props.staffUsers.find(
            (staffMember) => staffMember.label === occurenceReporter
          )?.lastName ||
          currentUser.lastname,
      };
    }
    return { value: null, label: null, firstName: null, lastName: null };
  };

  // Initalise store with issue or default value
  useEffect(() => {
    if (props.isOpen) {
      const claimInformationValues = {
        personName: getPersonNameObject(),
        contactNumber: issue.workers_comp?.reporter_phone_number || null,
        policyNumber:
          issue.workers_comp?.policy_number ||
          organisation?.extended_attributes?.berkley_policy_number ||
          null,
        lossDate:
          issue.workers_comp?.loss_date ||
          (issue?.occurrence_date &&
            moment(issue.occurrence_date).format(
              DateFormatter.dateTransferFormat
            )),
        lossCity: issue.workers_comp?.loss_city || null,
        lossState: issue.workers_comp?.loss_state || null,
        lossJurisdiction: issue.workers_comp?.loss_jurisdiction || null,
        lossDescription:
          issue.workers_comp?.loss_description ||
          getLossDescriptionDefaultValue() ||
          null,
        side:
          issue.workers_comp?.side_id ||
          issue.coding?.clinical_impressions?.side_id ||
          null,
        bodyArea:
          issue.workers_comp?.body_area_id ||
          issue.coding?.clinical_impressions
            ?.clinical_impression_body_area_id ||
          null,
      };
      const additionalInformationValues = {
        firstName:
          issue.workers_comp?.athlete_first_name || props.athleteData.firstname,
        lastName:
          issue.workers_comp?.athlete_last_name || props.athleteData.lastname,
        dateOfBirth:
          (issue.workers_comp?.athlete_dob &&
            DateFormatter.formatStandard({
              date: moment(issue.workers_comp?.athlete_dob),
              showTime: false,
              showCompleteDate: false,
              displayLongDate: false,
            })) ||
          props.athleteData.date_of_birth,
        socialSecurityNumber:
          issue.workers_comp?.athlete_ssn ||
          props.athleteData.social_security_number,
        position:
          issue.workers_comp?.athlete_position || props.athleteData.position,

        // Editable fields
        address1:
          issue.workers_comp?.athlete_address_line_1 ||
          organisation.address?.line1 ||
          null,
        address2:
          issue.workers_comp?.athlete_address_line_2 ||
          organisation.address?.line2 ||
          null,
        city:
          issue.workers_comp?.athlete_city ||
          organisation.address?.city ||
          null,
        state:
          issue.workers_comp?.athlete_state ||
          getAmericanStateOptions()?.find(
            (state) => state.label === organisation.address?.state
          )?.value || // state comes in as 2 letter code
          null,
        zipCode:
          issue.workers_comp?.athlete_zip ||
          organisation.address?.zipcode ||
          null,
        phoneNumber: issue.workers_comp?.athlete_phone_number || null,
      };

      dispatch(updateWorkersCompClaimInformation(claimInformationValues));
      dispatch(
        updateWorkersCompAdditionalInformation(additionalInformationValues)
      );
    }
  }, [props.isOpen, currentUser, props.staffUsers]);

  const formState = {
    issue_type: isChronicIssue ? 'chronic_condition' : issueType.toLowerCase(),
    issue_id: issue.id,
    athlete_id: props.athleteData.id,
    reporter_first_name: claimInformation.personName?.firstName,
    reporter_last_name: claimInformation.personName?.lastName,
    reporter_phone_number: claimInformation.contactNumber,
    loss_date: moment(claimInformation.lossDate).format(
      DateFormatter.dateTransferFormat
    ),
    loss_description: claimInformation.lossDescription,
    side: claimInformation.side,
    body_area: claimInformation.bodyArea,
    loss_city: claimInformation.lossCity,
    loss_state: claimInformation.lossState,
    loss_jurisdiction: claimInformation.lossJurisdiction,
    policy_number: claimInformation.policyNumber,
    athlete_first_name: additionalInformation.firstName,
    athlete_last_name: additionalInformation.lastName,
    athlete_address_line_1: additionalInformation.address1,
    athlete_address_line_2: additionalInformation.address2,
    athlete_city: additionalInformation.city,
    athlete_state: additionalInformation.state,
    athlete_zip: additionalInformation.zipCode,
    athlete_phone_number: additionalInformation.phoneNumber,
    athlete_dob: moment(additionalInformation.dateOfBirth).format(
      DateFormatter.dateTransferFormat
    ),
    athlete_position: additionalInformation.position,
    social_security_number: additionalInformation.socialSecurityNumber,
  };

  useEffect(() => {
    // Ensuring that we never send empty string to BE
    Object.keys(formState).forEach((field) => {
      if (formState[field] === '') {
        formState[field] = null;
      }
    });
  }, [formState]);

  return (
    <div data-testid="AddWorkersCompSidePanel__container">
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={props.t("Workers' comp claim")}
        onClose={props.onClose}
        width={659}
      >
        {!isSubmitted && (
          <div
            css={styles.progressBar}
            data-testid="AddWorkersCompSidePanel|ProgressBar"
          >
            <ProgressTracker
              currentHeadingId={currentPage}
              headings={[
                { id: 1, name: props.t('Claim information') },
                { id: 2, name: props.t('Player information') },
                { id: 3, name: props.t('Preview and print') },
              ]}
              progressNext={() => dispatch(goToNextPanelPage())}
              progressBack={() => dispatch(goToPreviousPanelPage())}
              formValidation={() => isRequiredFieldsInvalid()}
            />
          </div>
        )}

        {renderPanelContent()}

        {currentPage === 3 && isRequiredFieldsInvalid() && (
          <div
            data-testid="AddWorkersCompSidePanel|InvalidList"
            css={styles.invalidList}
          >
            <h6>
              <span css={styles.alertIcon} className="icon-alert" />
              {props.t('Mandatory fields that are needed before submitting')}
            </h6>
            <ul>{renderInvalidList()}</ul>
          </div>
        )}

        <div
          css={styles.navigationButtonsContainer}
          data-testid="AddWorkersCompSidePanel|ButtonsContainer"
        >
          {currentPage !== 1 && !isSubmitted && (
            <div
              data-testid="AddWorkersCompSidePanel|BackButton"
              css={styles.backButton}
            >
              <TextButton
                text={props.t('Back')}
                type="secondary"
                kitmanDesignSystem
                onClick={() => dispatch(goToPreviousPanelPage())}
              />
            </div>
          )}

          {currentPage === 3 && (
            <div data-testid="AddWorkersCompSidePanel|PrintButton">
              <TextButton
                text={props.t('Print')}
                type={!isSubmitted ? 'textOnly' : 'primary'}
                kitmanDesignSystem
                onClick={() => {
                  setSaveDraftRequestStatus('PENDING');
                  saveDraftWorkersComp(formState)
                    .then((data) => {
                      setSaveDraftRequestStatus('SUCCESS');
                      props.onClose();
                      updateIssue({ ...issue, workers_comp: data });
                    })
                    .catch((err) => {
                      setSaveDraftRequestStatus('FAILURE');
                      console.error(err.responseText);
                    })
                    .finally(() =>
                      dispatch(
                        printWorkersCompFromSidePanel(
                          true,
                          sides?.find(
                            (side) => side.id === claimInformation?.side
                          )?.name,
                          bodyAreaOptions?.find(
                            (bodyArea) =>
                              bodyArea.id === claimInformation.bodyArea
                          )?.name
                        )
                      )
                    );
                }}
              />
            </div>
          )}

          {!isSubmitted && (
            <div data-testid="AddWorkersCompSidePanel|SaveDraftButton">
              <TextButton
                text={props.t('Save draft')}
                type="textOnly"
                onClick={() => {
                  setSaveDraftRequestStatus('PENDING');
                  saveDraftWorkersComp(formState)
                    .then((data) => {
                      setSaveDraftRequestStatus('SUCCESS');
                      props.onClose();
                      updateIssue({ ...issue, workers_comp: data });
                    })
                    .catch((err) => {
                      setSaveDraftRequestStatus('FAILURE');
                      console.error(err.responseText);
                    });
                }}
                kitmanDesignSystem
              />
            </div>
          )}

          {currentPage === 3 && !isSubmitted && (
            <div data-testid="AddWorkersCompSidePanel|SubmitToInsuranceButton">
              <TextButton
                text={props.t('Submit to insurance')}
                type="primary"
                kitmanDesignSystem
                onClick={() => {
                  dispatch(closeWorkersCompSidePanel());
                  dispatch(showWorkersCompSubmitModal(formState));
                }}
                isDisabled={isRequiredFieldsInvalid()}
              />
            </div>
          )}

          {currentPage !== 3 && !isSubmitted && (
            <div data-testid="AddWorkersCompSidePanel|NextButton">
              <TextButton
                text={props.t('Next')}
                type="primary"
                kitmanDesignSystem
                onClick={() => dispatch(goToNextPanelPage())}
              />
            </div>
          )}
        </div>

        {(saveDraftRequestStatus || props.staffUsersRequestStatus) &&
          saveDraftRequestStatus !== 'SUCCESS' && (
            <AppStatus status={hasRequestFailed ? 'error' : 'loading'} />
          )}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddWorkersCompSidePanelTranslated = withNamespaces()(
  AddWorkersCompSidePanel
);
export default AddWorkersCompSidePanel;
