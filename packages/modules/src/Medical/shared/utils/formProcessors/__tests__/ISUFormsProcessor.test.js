import moment from 'moment-timezone';
import {
  countries,
  timezones,
} from '@kitman/services/src/mocks/handlers/getFormDataSourceItems';
import processForm from '../formResultsDefaultProcessor';

import authorizationReleaseMedicalInformationMock, {
  expectedFormInfoResult as authorizationReleaseInfoResult,
  expectedFormattedResults as authorizationReleaseResults,
} from './mocks/authorizationReleaseMedicalInformationMock';

import consentTreatmentOfMinorMock, {
  expectedFormInfoResult as consentTreatmentOfMinorInfoResult,
  expectedFormattedResults as consentTreatmentOfMinorResults,
} from './mocks/consentTreatmentOfMinorMock';

import demographicsAndInfoMock, {
  expectedFormInfoResult as demographicsAndInformationInfo,
  expectedFormattedResults as demographicsAndInformationResults,
} from './mocks/demographicsAndInfoMock';

import insuranceInformationVerificationMock, {
  expectedFormInfoResult as insuranceInformationInfo,
  expectedFormattedResults as insuranceInformationResults,
} from './mocks/insuranceInformationVerificationMock';

import preParticipationMedicalHistoryMock, {
  expectedFormInfoResult as preParticipationInfo,
  expectedFormattedResults as preParticipationResults,
} from './mocks/preParticipationMedicalHistoryMock';

import releaseIndemnificationMock, {
  expectedFormInfoResult as releaseIndemnificationInfo,
  expectedFormattedResults as releaseIndemnificationResults,
} from './mocks/releaseIndemnificationMock';

import supplementErgogenicAidNotificationMock, {
  expectedFormInfoResult as supplementErgogenicAidInfo,
  expectedFormattedResults as supplementErgogenicAidResults,
} from './mocks/supplementErgogenicAidNotificationMock';

import verificationMedicalPoliciesProceduresMock, {
  expectedFormInfoResult as verificationMedicalPoliciesProceduresInfo,
  expectedFormattedResults as verificationMedicalPoliciesProceduresInfoResults,
} from './mocks/verificationMedicalPoliciesProceduresMock';

describe('ISUFormsProcessor', () => {
  let locale;
  beforeEach(() => {
    locale = moment.locale();
    moment.locale('en');
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.locale(locale);
    moment.tz.setDefault();
  });

  it('correctly processes an Authorization for Release of Medical Information form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      authorizationReleaseMedicalInformationMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(authorizationReleaseInfoResult);

    // Test we have expected sections.
    expect(formattedFormResults).toHaveLength(1);
    expect(formattedFormResults).toEqual(authorizationReleaseResults);
  });

  it('correctly processes a Consent for Treatment of a Minor form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      consentTreatmentOfMinorMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(consentTreatmentOfMinorInfoResult);

    // Test we have expected sections.
    expect(formattedFormResults).toHaveLength(1);
    expect(formattedFormResults).toEqual(consentTreatmentOfMinorResults);
  });

  it('correctly processes a Demographics and Information form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      demographicsAndInfoMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(demographicsAndInformationInfo);

    // Test we have expected sections.
    expect(formattedFormResults).toHaveLength(1);
    expect(formattedFormResults).toEqual(demographicsAndInformationResults);
  });

  it('correctly processes an Insurance Information and Verification form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      insuranceInformationVerificationMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(insuranceInformationInfo);

    // Test we have expected sections.
    expect(formattedFormResults).toHaveLength(2);
    expect(formattedFormResults).toEqual(insuranceInformationResults);
  });

  it('correctly processes a Pre-Participation Medical History Questionnaire form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      preParticipationMedicalHistoryMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(preParticipationInfo);

    // Test we have expected sections.
    expect(formattedFormResults).toHaveLength(2);
    expect(formattedFormResults).toEqual(preParticipationResults);
  });

  it('correctly processes a Release and Indemnification form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      releaseIndemnificationMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(releaseIndemnificationInfo);

    // Test we have expected sections.
    expect(formattedFormResults).toHaveLength(1);
    expect(formattedFormResults).toEqual(releaseIndemnificationResults);
  });

  it('correctly processes a Student-athlete Supplement/Ergogenic Aid Notification Form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      supplementErgogenicAidNotificationMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(supplementErgogenicAidInfo);

    // Test we have expected sections.
    expect(formattedFormResults).toHaveLength(1);
    expect(formattedFormResults).toEqual(supplementErgogenicAidResults);
  });

  it('correctly processes a Verification of Medical Policies and Procedures Form', () => {
    const { formattedFormResults, formInfoResult } = processForm(
      verificationMedicalPoliciesProceduresMock,
      {
        countries,
        timezones,
        injuries: [],
      }
    );

    expect(formInfoResult).toEqual(verificationMedicalPoliciesProceduresInfo);

    // Test we have expected sections.
    expect(formattedFormResults).toHaveLength(2);
    expect(formattedFormResults).toEqual(
      verificationMedicalPoliciesProceduresInfoResults
    );
  });
});
