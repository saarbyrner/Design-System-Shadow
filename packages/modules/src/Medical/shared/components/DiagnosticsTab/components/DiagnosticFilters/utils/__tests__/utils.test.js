import { getPACSUploaderLink, getPACSViewerLink, getProviderOptions } from '..';

import {
  orderProviders,
  transformedOrderProviders,
  athleteData,
  athleteExternalId,
  athleteTrialData,
  currentOrganisation,
  currentUser,
  issue,
} from '../testUtils';

describe('getPACSUploaderLink', () => {
  describe('when athlete is in organisation', () => {
    it('returns correct link on roster level', () => {
      expect(
        getPACSUploaderLink(null, null, currentOrganisation, currentUser)
      ).toEqual(
        'https://nfl.ambrahealth.com/api/v3/link/redirect?uuid=TEAM_UPLOAD_UUID_726263_92221&email_address=billiusTheUser@junglejapes.io&suppress_notification=1'
      );
    });

    it('returns correct link on athlete and issue levels', () => {
      expect(
        getPACSUploaderLink(
          athleteData,
          athleteExternalId,
          currentOrganisation,
          currentUser
        )
      ).toEqual(
        'https://nfl.ambrahealth.com/api/v3/link/redirect?uuid=TEAM_UPLOAD_UUID_726263_92221&email_address=billiusTheUser@junglejapes.io&suppress_notification=1&integration_key=JAPES%5EJUNGLE:3894612043421:19900113'
      );
    });
  });

  describe('when athlete is a TRIAL player', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2022-12-10T05:04:33'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns correct link on athlete and issue levels', () => {
      expect(
        getPACSUploaderLink(
          athleteTrialData,
          athleteExternalId,
          currentOrganisation,
          currentUser
        )
      ).toEqual(
        'https://nfl.ambrahealth.com/api/v3/link/redirect?uuid=TRYOUT_UPLOAD_UUID_1283718_93843&email_address=billiusTheUser@junglejapes.io&suppress_notification=1&integration_key=JAPES%5EJUNGLE:3894612043421:19900113'
      );
    });
  });
});

describe('getPACSViewerLink', () => {
  describe('when athlete is in organisation', () => {
    it('returns correct link on roster level', () => {
      expect(getPACSViewerLink(null, null, null, currentOrganisation)).toEqual(
        'https://nfl.ambrahealth.com/api/v3/session/sso/start?namespace_id=TEAM_NAMESPACE_UUID_4234134_23421'
      );
    });

    it('returns correct link on athlete level', () => {
      expect(
        getPACSViewerLink(
          null,
          athleteData,
          athleteExternalId,
          currentOrganisation
        )
      ).toEqual(
        'https://nfl.ambrahealth.com/api/v3/session/sso/start?namespace_id=TEAM_NAMESPACE_UUID_4234134_23421&patient_id=3894612043421'
      );
    });

    it('returns correct link on issue level', () => {
      expect(
        getPACSViewerLink(
          issue,
          athleteData,
          athleteExternalId,
          currentOrganisation
        )
      ).toEqual(
        'https://nfl.ambrahealth.com/api/v3/session/sso/start?namespace_id=TEAM_NAMESPACE_UUID_4234134_23421&customfield-FA41234SFD_CUSTOM_FIELD_UUID_2134231=324134FASDFASD_2315_fasdfsd_32145'
      );
    });
  });

  describe('when athlete is a TRIAL player', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2022-12-10T05:04:33'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns correct link on athlete level', () => {
      expect(
        getPACSViewerLink(
          null,
          athleteTrialData,
          athleteExternalId,
          currentOrganisation
        )
      ).toEqual(
        'https://nfl.ambrahealth.com/api/v3/session/sso/start?namespace_id=TRYOUT_NAMESPACE_UUID_FSDAF&patient_id=3894612043421'
      );
    });

    it('returns correct link on issue level', () => {
      expect(
        getPACSViewerLink(
          issue,
          athleteTrialData,
          athleteExternalId,
          currentOrganisation
        )
      ).toEqual(
        'https://nfl.ambrahealth.com/api/v3/session/sso/start?namespace_id=TRYOUT_NAMESPACE_UUID_FSDAF&customfield-FA41234SFD_CUSTOM_FIELD_UUID_2134231=324134FASDFASD_2315_fasdfsd_32145'
      );
    });
  });
});

describe('getProviderOptions', () => {
  describe('when provider data exists', () => {
    it('returns correctly formatted array for select options', () => {
      expect(getProviderOptions(orderProviders)).toEqual(
        transformedOrderProviders
      );
    });
  });

  describe('when no provider data exists', () => {
    it('returns empty array', () => {
      expect(getProviderOptions()).toEqual([]);
      expect(getProviderOptions(undefined)).toEqual([]);
      expect(getProviderOptions(null)).toEqual([]);
      expect(getProviderOptions([])).toEqual([]);
      expect(getProviderOptions('')).toEqual([]);
      expect(getProviderOptions(0)).toEqual([]);
    });
  });
});
