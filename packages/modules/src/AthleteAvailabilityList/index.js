/* eslint-disable flowtype/require-valid-file-annotation */
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import i18n from '@kitman/common/src/utils/i18n';
import {
  AppStatus as AppStatusComponent,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import {
  setupReduxDevTools,
  getGroupOrderingByType,
  parseNoteMedicalTypeOptions,
} from '@kitman/common/src/utils';
import {
  getGrades,
  getPermissions,
  getSides,
  getIllnessOsicsPathologies,
  getInjuryOsicsPathologies,
  getInjuryStatuses,
} from '@kitman/services';
import { getDefaultDiagnosticData } from './utils';
import App from './src/containers/App';
import {
  athletes,
  issueStaticData,
  addAbsenceModal,
  noteModal,
  modInfoModal,
  modRTPModal,
  treatmentSessionModal,
  fileUploadToast,
  diagnosticModal,
  injuryUploadModal,
  appStatus,
} from './src/reducer';

// setup Redux dev tools
const middlewares = [thunkMiddleware, globalApi.middleware];
const composeEnhancers = setupReduxDevTools(compose);

const StateTree = combineReducers({
  athletes,
  issueStaticData,
  addAbsenceModal,
  noteModal,
  modInfoModal,
  modRTPModal,
  treatmentSessionModal,
  fileUploadToast,
  diagnosticModal,
  injuryUploadModal,
  appStatus,
  globalApi: globalApi.reducer,
});

const groupBy =
  window.localStorage && window.localStorage.getItem('groupBy')
    ? window.localStorage.getItem('groupBy')
    : 'positionGroup';

const localTimezone = document.getElementsByTagName('body')[0].dataset.timezone;

const getStore = (data) => {
  const groupOrderingByType = getGroupOrderingByType(data.positions_hash);
  const transformedCovidResults = data.covid_results.map((covidResult) => ({
    id: covidResult,
    title: covidResult,
  }));
  const transformedCovidAntibodyResults = data.covid_antibody_results.map(
    (covidAntibodyResult) => ({
      id: covidAntibodyResult,
      title: covidAntibodyResult,
    })
  );
  const transformedDiagnosticTypes = data.diagnostic_types.reduce(
    (dropdownItems, type) => {
      dropdownItems.push({
        id: type[1],
        title: type[0],
      });
      return dropdownItems;
    },
    []
  );
  const users = data.users.sort((a, b) => {
    const lowercaseA = a.lastname.toLowerCase();
    const lowercaseB = b.lastname.toLowerCase();
    if (lowercaseA > lowercaseB) {
      return 1;
    }
    if (lowercaseA < lowercaseB) {
      return -1;
    }
    return 0;
  });
  const formattedUsers = users.map((user) => ({
    id: user.id,
    name: user.fullname,
  }));
  const transformedRestrictAccessList = data.restrict_access_list.map(
    (restrictAccessItem) => ({
      id: restrictAccessItem,
      title: restrictAccessItem,
    })
  );

  return createStore(
    StateTree,
    {
      athletes: {
        all: [],
        grouped: {
          position: {},
          positionGroup: {},
          availability: {},
          last_screening: {},
          name: {},
        },
        currentlyVisible: {},
        groupBy,
        groupOrderingByType,
        isFilterShown: false,
        athleteFilters: [],
        availabilityFilters: data.selected_availability_filters,
        groupingLabels: data.grouping_labels,
        availabilityByPositionGroup: data.availability_by_position_group,
        availabilityByPosition: data.availability_by_position,
        orgLogoPath: data.org_logo_path,
        totalAvailableAthletes: data.total_available_athletes,
        totalAthleteCount: data.total_athlete_count,
        squadAvailabilityPercentage: data.squad_availability_percentage,
        currentOrgName: data.current_org_name,
        currentSquadName: data.current_squad_name,
        currentUserName: data.current_user_name,
      },
      issueStaticData: {
        injuryOsicsPathologies: data.injuryOsicsPathologies || [],
        illnessOsicsPathologies: data.illnessOsicsPathologies || [],
        absenceReasons: data.absence_reasons,
        issueStatusOptions: data.injuryStatuses || [],
        sides: data.sides || [],
        canManageIssues: data.permissions.canManageIssues,
        canViewIssues: data.permissions.canViewIssues,
        canViewAbsences: data.permissions.canViewAbsences,
        canManageAbsences: data.permissions.canManageAbsences,
        canManageMedicalNotes: data.permissions.canManageMedicalNotes,
        canViewNotes: data.permissions.canViewNotes,
        diagnosticTypes: transformedDiagnosticTypes,
        diagnosticsWithExtraFields: data.diagnostics_with_extra_fields,
        covidResults: transformedCovidResults,
        covidAntibodyResults: transformedCovidAntibodyResults,
        restrictAccessList: transformedRestrictAccessList,
        bamicGrades: data.bamicGrades || [],
      },
      addAbsenceModal: {
        absenceData: {
          reason_id: null,
          from: '',
          to: '',
          athlete_id: null,
        },
        absenceReasons: [],
        athlete: null,
        isModalOpen: false,
      },
      treatmentSessionModal: {
        isModalOpen: false,
        athlete: {
          fullname: '',
          id: null,
        },
        treatmentSession: {
          athlete_id: null,
          user_id: data.current_user.id,
          timezone: localTimezone,
          title: 'Treatment Note',
          treatments_attributes: [
            {
              treatment_modality_id: null,
              duration: null,
              reason: null,
              issue_type: null,
              issue_id: null,
              treatment_body_areas_attributes: [],
              note: '',
            },
          ],
          annotation_attributes: {
            content: '',
            attachments_attributes: [],
          },
        },
        unUploadedFiles: [],
        staticData: {
          bodyAreaOptions: [],
          treatmentModalityOptions: [],
          reasonOptions: [],
          users: formattedUsers,
        },
      },
      fileUploadToast: {
        fileOrder: [],
        fileMap: {},
      },
      noteModal: {
        athlete: null,
        athleteInjuries: [],
        athleteIllnesses: [],
        isModalOpen: false,
        attachments: [],
        noteData: {
          attachment_ids: [],
          note_date: null,
          note_type: null,
          medical_type: null,
          medical_name: null,
          injury_ids: [],
          illness_ids: [],
          note: '',
          expiration_date: null,
          batch_number: null,
          renewal_date: null,
          restricted: false,
          psych_only: false,
        },
        requestStatus: {
          status: null,
          message: null,
        },
        noteMedicalTypeOptions: parseNoteMedicalTypeOptions(
          data.note_medical_type_options
        ),
      },
      modInfoModal: {
        athlete: null,
        isModalOpen: false,
        modInfoData: {
          info: '',
          rtp: '',
        },
      },
      modRTPModal: {
        athlete: null,
        isModalOpen: false,
        modRTPData: {
          rtp: '',
        },
      },
      diagnosticModal: {
        athlete: null,
        isModalOpen: false,
        athleteInjuries: [],
        athleteIllnesses: [],
        attachments: [],
        diagnosticData: getDefaultDiagnosticData(),
      },
      injuryUploadModal: {
        isModalOpen: false,
        file: null,
        errors: {
          messages: null,
          totalRows: null,
          skippedRows: null,
        },
      },
      appStatus: {
        status: null,
        message: null,
      },
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

const AvailabilitiesApp = () => {
  const [data, setData] = useState();
  const [requestStatus, setRequestStatus] = useState('PENDING');

  useEffect(() => {
    Promise.all([
      $.getJSON('/athletes/availabilities/availabilities_initial_data'),
      getPermissions(),
      getSides(),
      getInjuryOsicsPathologies(),
      getIllnessOsicsPathologies(),
      getGrades,
      getInjuryStatuses(),
    ]).then(
      ([
        initialData,
        permissions,
        sides,
        injuryOsicsPathologies,
        illnessOsicsPathologies,
        bamicGrades,
        injuryStatuses,
      ]) => {
        setData({
          ...initialData,
          permissions: {
            canManageIssues: permissions.medical?.includes('issues-admin'),
            canViewIssues: permissions.medical?.includes('issues-view'),
            canViewAbsences: permissions.general?.includes('view-absence'),
            canManageAbsences: permissions.general?.includes('manage-absence'),
            canManageMedicalNotes: permissions.notes?.includes('medical-notes'),
            canViewNotes: permissions.notes?.includes('view'),
          },
          sides,
          injuryOsicsPathologies,
          illnessOsicsPathologies,
          bamicGrades,
          injuryStatuses,
        });
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  switch (requestStatus) {
    case 'FAILURE':
      return <AppStatusComponent status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <Provider store={getStore(data)}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </I18nextProvider>
        </Provider>
      );
    default:
      return null;
  }
};

export default AvailabilitiesApp;
