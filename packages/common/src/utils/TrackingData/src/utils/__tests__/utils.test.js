import mixpanel from 'mixpanel-browser';
import {
  mixpanelInit,
  mixpanelIdentify,
  mixpanelTrackPageView,
  mixpanelTrack,
  mixpanelRegister,
} from '..';

jest.mock('mixpanel-browser');

describe('TrackingData utils', () => {
  const initSpy = jest.spyOn(mixpanel, 'init');
  const identifySpy = jest.spyOn(mixpanel, 'identify');
  const pageViewSpy = jest.spyOn(mixpanel, 'track_pageview');
  const trackSpy = jest.spyOn(mixpanel, 'track');
  const registerSpy = jest.spyOn(mixpanel, 'register');

  const mockGroupProperties = {
    Organisation: 'Liverpool FC',
    Association: 'Premier League',
    Sport: 'Football',
  };

  beforeEach(() => {
    window.featureFlags = {};
    delete window.location;
    window.location = new URL('http://kitman.staging.com');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('mixpanelInit', () => {
    describe('[disable-mixpanel-tracking]', () => {
      beforeEach(() => {
        window.featureFlags['single-page-application'] = true;
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('should not call mixpanelInit if killswitch FF is enabled', () => {
        window.featureFlags['disable-mixpanel-tracking'] = true;

        mixpanelInit();
        expect(initSpy).not.toHaveBeenCalled();
      });

      it('should call mixpanelInit if FF is disabled', () => {
        window.featureFlags['disable-mixpanel-tracking'] = false;

        mixpanelInit();
        expect(initSpy).toHaveBeenCalled();
      });
    });

    describe('[single-page-application]', () => {
      beforeEach(() => {
        window.featureFlags['disable-mixpanel-tracking'] = false;
        window.mixpanel = { init: jest.fn() };
      });

      afterEach(() => {
        window.featureFlags = {};
        window.mixpanel = {};

        jest.restoreAllMocks();
      });

      it('should call mixpanelInit yarn package function if single-page-application is true', () => {
        window.featureFlags['single-page-application'] = true;

        mixpanelInit('123');
        expect(initSpy).toHaveBeenCalled();
        expect(window.mixpanel.init).not.toHaveBeenCalled();
      });

      it('should call mixpanelInit function defined on window if single-page-application is false', () => {
        mixpanelInit('123');
        expect(window.mixpanel.init).toHaveBeenCalled();
        expect(initSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('mixpanelIdentify', () => {
    describe('[disable-mixpanel-tracking]', () => {
      beforeEach(() => {
        window.featureFlags['single-page-application'] = true;
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('should not call mixpanelIdentify if killswitch FF is enabled', () => {
        window.featureFlags['disable-mixpanel-tracking'] = true;

        mixpanelIdentify('123');
        expect(identifySpy).not.toHaveBeenCalled();
      });

      it('should call mixpanelIdentify with data passed as params if FF is disabled', () => {
        window.featureFlags['disable-mixpanel-tracking'] = false;

        mixpanelIdentify('123');
        expect(identifySpy).toHaveBeenCalledWith('123');
      });
    });

    describe('[single-page-application]', () => {
      beforeEach(() => {
        window.featureFlags['single-page-application'] = true;
        window.mixpanel = { identify: jest.fn() };
      });

      afterEach(() => {
        window.featureFlags = {};
        window.mixpanel = {};
        jest.restoreAllMocks();
      });

      it('should call mixpanelIdentify yarn package function if single-page-application is true', () => {
        window.featureFlags['single-page-application'] = true;

        mixpanelIdentify('123');
        expect(identifySpy).toHaveBeenCalledWith('123');
        expect(window.mixpanel.identify).not.toHaveBeenCalled();
      });

      it('should call mixpanelIdentify function defined on window if single-page-application is false', () => {
        window.featureFlags['single-page-application'] = false;

        mixpanelIdentify('123');
        expect(window.mixpanel.identify).toHaveBeenCalledWith('123');
        expect(identifySpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('mixpanelTrackPageView', () => {
    describe('[disable-mixpanel-tracking]', () => {
      beforeEach(() => {
        window.featureFlags['single-page-application'] = true;
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('should not call mixpanelTrackPageView if killswitch FF is enabled', () => {
        window.featureFlags['disable-mixpanel-tracking'] = true;

        mixpanelTrackPageView();
        expect(pageViewSpy).not.toHaveBeenCalled();
      });

      it('should call mixpanelTrackPageView with data passed as params if FF is disabled', () => {
        window.featureFlags['disable-mixpanel-tracking'] = false;

        mixpanelTrackPageView();
        expect(pageViewSpy).toHaveBeenCalled();
      });
    });
  });

  describe('mixpanelTrack', () => {
    describe('[disable-mixpanel-tracking]', () => {
      beforeEach(() => {
        window.featureFlags['single-page-application'] = true;
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('should not call mixpanelTrack if killswitch FF is enabled', () => {
        window.featureFlags['disable-mixpanel-tracking'] = true;

        mixpanelTrack('Test event', { test: 'data' });
        expect(trackSpy).not.toHaveBeenCalled();
      });

      it('should call mixpanelTrack with data passed as params if FF is disabled', () => {
        window.featureFlags['disable-mixpanel-tracking'] = false;

        mixpanelTrack('Test event', { test: 'data' });
        expect(trackSpy).toHaveBeenCalledWith('Test event', {
          test: 'data',
        });
      });
    });

    describe('[single-page-application]', () => {
      beforeEach(() => {
        window.featureFlags['disable-mixpanel-tracking'] = false;
        window.mixpanel = { track: jest.fn() };
      });

      afterEach(() => {
        window.featureFlags = {};
        window.mixpanel = {};
        jest.restoreAllMocks();
      });

      it('should call mixpanelTrack yarn package function if single-page-application is true', () => {
        window.featureFlags['single-page-application'] = true;

        mixpanelTrack('Test event', { test: 'data' });
        expect(trackSpy).toHaveBeenCalledWith('Test event', {
          test: 'data',
        });
        expect(window.mixpanel.track).not.toHaveBeenCalled();
      });

      it('should call mixpanelTrack function defined on window if single-page-application is false', () => {
        mixpanelTrack('Test event', { test: 'data' });
        expect(window.mixpanel.track).toHaveBeenCalledWith('Test event', {
          test: 'data',
        });
        expect(trackSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('mixpanelRegister', () => {
    describe('[disable-mixpanel-tracking]', () => {
      beforeEach(() => {
        window.featureFlags['single-page-application'] = true;
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('should not call mixpanelRegister if killswitch FF is enabled', () => {
        window.featureFlags['disable-mixpanel-tracking'] = true;

        mixpanelRegister(mockGroupProperties);
        expect(registerSpy).not.toHaveBeenCalled();
      });

      it('should call mixpanelRegister with group properties if FF is disabled', () => {
        window.featureFlags['disable-mixpanel-tracking'] = false;

        mixpanelRegister(mockGroupProperties);
        expect(registerSpy).toHaveBeenCalledWith(mockGroupProperties);
      });
    });
  });
});
