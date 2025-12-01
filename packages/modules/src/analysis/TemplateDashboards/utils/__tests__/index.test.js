import {
  getLocalStorageKey,
  isDevelopmentJourney,
  isMedicalSummary,
  isCoachingSummary,
  isGrowthAndMaturationReport,
  isStaffDevelopment,
  getSortedStaffUsers,
  isColorCodedChart,
  getWidgetCategoryColors,
  getInitialTab,
} from '..';

describe('TemplateDashboard|utils', () => {
  describe('isDevelopmentJourney', () => {
    beforeEach(() => {
      delete window.location;
      window.location = { pathname: '/development_journey' };
    });

    it('should return true if pathname includes "development_journey"', () => {
      const result = isDevelopmentJourney();
      expect(result).toBe(true);
    });

    it('should return false if pathname does not include "development_journey"', () => {
      window.location.pathname = '/some-other-path';
      const result = isDevelopmentJourney();
      expect(result).toBe(false);
    });
  });

  describe('isMedicalSummary', () => {
    beforeEach(() => {
      delete window.location;
      window.location = { pathname: '/medical' };
    });

    it('should return true if pathname includes "medical"', () => {
      const result = isMedicalSummary();
      expect(result).toBe(true);
    });

    it('should return false if pathname does not include "medical"', () => {
      window.location.pathname = '/some-other-path';
      const result = isMedicalSummary();
      expect(result).toBe(false);
    });
  });

  describe('isCoachingSummary', () => {
    beforeEach(() => {
      delete window.location;
      window.location = { pathname: '/coaching_summary' };
    });

    it('should return true if pathname includes "coaching_summary"', () => {
      const result = isCoachingSummary();
      expect(result).toBe(true);
    });

    it('should return false if pathname does not include "coaching_summary"', () => {
      window.location.pathname = '/some-other-path';
      const result = isCoachingSummary();
      expect(result).toBe(false);
    });
  });

  describe('isGrowthAndMaturationReport', () => {
    beforeEach(() => {
      delete window.location;
      window.location = { pathname: '/growth_and_maturation' };
    });

    it('should return true if pathname includes "growth_and_maturation"', () => {
      const result = isGrowthAndMaturationReport();
      expect(result).toBe(true);
    });

    it('should return false if pathname does not include "growth_and_maturation"', () => {
      window.location.pathname = '/some-other-path';
      const result = isGrowthAndMaturationReport();
      expect(result).toBe(false);
    });
  });

  describe('isStaffDevelopment', () => {
    beforeEach(() => {
      delete window.location;
      window.location = { pathname: '/staff_development' };
    });

    it('should return true if pathname includes "staff_development"', () => {
      const result = isStaffDevelopment();
      expect(result).toBe(true);
    });

    it('should return false if pathname does not include "staff_development"', () => {
      window.location.pathname = '/some-other-path';
      const result = isStaffDevelopment();
      expect(result).toBe(false);
    });
  });

  describe('getLocalStorageKey', () => {
    it('should return correct local storage key for "development_journey" path', () => {
      window.location.pathname =
        '/analysis/template_dashboards/development_journey';
      const result = getLocalStorageKey();
      expect(result).toBe('Reporting|templateDashboardsFilterDevelopment');
    });

    it('should return correct local storage key for "coaching_summary" path', () => {
      window.location.pathname =
        '/analysis/template_dashboards/coaching_summary';
      const result = getLocalStorageKey();
      expect(result).toBe('Reporting|templateDashboardsFilterCoaching');
    });

    it('should return correct local storage key for "medical" path', () => {
      window.location.pathname = '/analysis/template_dashboards/medical';
      const result = getLocalStorageKey();
      expect(result).toBe('Reporting|templateDashboardsFilterMedical');
    });
  });

  describe('getInitialTab', () => {
    const mockTabPanes = [
      {
        title: 'Session Summary',
        tabHash: '#session-summary',
        content: null,
        tabKey: '0',
      },
      {
        title: 'Game Summary',
        tabHash: '#game-summary',
        content: null,
        tabKey: '1',
      },
    ];
    it('should return game summary tab value', () => {
      window.location.hash = '#game-summary';
      const result = getInitialTab(mockTabPanes);
      expect(result).toBe('1');
    });

    it('should return default tab value', () => {
      window.location.hash = '#game-summary-not-included';
      const result = getInitialTab(mockTabPanes);
      expect(result).toBe('0');
    });
  });

  describe('getSortedStaffUsers', () => {
    it('should return sorted staff users', () => {
      const mockStaffUsers = [
        {
          id: 1,
          firstname: 'Hamza',
          lastname: 'Khan',
          fullname: 'Hamza Khan',
        },
        {
          id: 2,
          firstname: 'Georgia',
          lastname: 'Robinson',
          fullname: 'Georgia Robinson',
        },
        {
          id: 3,
          firstname: 'Ian',
          lastname: "O'Connor",
          fullname: "Ian O'Connor",
        },
        {
          id: 4,
          firstname: 'Damien',
          lastname: 'McDonnell',
          fullname: 'Damien McDonnell',
        },
      ];
      const result = getSortedStaffUsers(mockStaffUsers);
      expect(result).toEqual([
        { value: 4, label: 'Damien McDonnell' },
        { value: 2, label: 'Georgia Robinson' },
        { value: 1, label: 'Hamza Khan' },
        { value: 3, label: "Ian O'Connor" },
      ]);
    });
  });

  describe('isColorCodedChart', () => {
    const emptyConfigData = {};
    const configDataWithCustomEventTypeCategoryGrouping = {
      groupings: ['custom_event_type_category', 'custom_event_type'],
      orientation: 'horizontal',
    };
    const configDataWithoutCustomEventTypeCategoryGrouping = {
      groupings: ['custom_event_type'],
      orientation: 'horizontal',
    };

    it('should return false when there is no groupings in the config data', async () => {
      const isEventCustomEventType = isColorCodedChart(emptyConfigData, '');
      expect(isEventCustomEventType).toEqual(false);
    });

    it('should return true when there is a grouping of custom_event_type in the config data', async () => {
      const isEventCustomEventType = isColorCodedChart(
        configDataWithCustomEventTypeCategoryGrouping,
        'custom_event_type_category'
      );
      expect(isEventCustomEventType).toEqual(true);
    });

    it('should return false when there is no grouping of custom_event_type_category in the config data', async () => {
      const isEventCustomEventType = isColorCodedChart(
        configDataWithoutCustomEventTypeCategoryGrouping,
        ''
      );
      expect(isEventCustomEventType).toEqual(false);
    });
  });

  describe('getWidgetCategoryColors', () => {
    const emptyData = {};
    const dataWithCategorisedCustomEvents = {
      global_colours: {
        grouping: 'custom_event_type_category',
        data: ['Category 1', 'Category 2', 'Category 3'],
      },
    };
    const dataWithoutCategorisedCustomEvents = {
      global_colours: {
        grouping: 'some_other_grouping',
        data: ['Any Grouping 1', 'Any Grouping 2', 'Any Grouping 3'],
      },
    };

    it('should return an empty array when there is no meta.global_colours in the data', async () => {
      const widgetColors = getWidgetCategoryColors(emptyData);
      expect(widgetColors).toEqual({
        grouping: '',
        colors: [],
      });
    });

    it('should return an array of category / color objects when there is meta.global_colours and custom events with categories in the data', async () => {
      const widgetColors = getWidgetCategoryColors(
        dataWithCategorisedCustomEvents
      );
      expect(widgetColors).toEqual({
        grouping: 'custom_event_type_category',
        colors: [
          { label: 'Category 1', value: '#2A6EBB' },
          { label: 'Category 2', value: '#E86427' },
          { label: 'Category 3', value: '#279C9C' },
        ],
      });
    });

    it('should return an array of category / color objects when there is any data grouping passed', async () => {
      const widgetColors = getWidgetCategoryColors(
        dataWithoutCategorisedCustomEvents
      );
      expect(widgetColors).toEqual({
        grouping: 'some_other_grouping',
        colors: [
          { label: 'Any Grouping 1', value: '#2A6EBB' },
          { label: 'Any Grouping 2', value: '#E86427' },
          { label: 'Any Grouping 3', value: '#279C9C' },
        ],
      });
    });
  });
});
