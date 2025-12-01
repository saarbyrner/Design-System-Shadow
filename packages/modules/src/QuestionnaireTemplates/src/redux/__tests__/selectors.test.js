import {
  getSearchText,
  getSearchStatus,
  getSearchScheduled,
  getSortingColumn,
  getSortingDirection,
  getTemplates,
} from '../selectors';

describe('<FormList /> Selector', () => {
  const mockTemplates = [
    {
      id: 1,
      name: 'template 2',
      last_edited_by: 'Iron Man',
      last_edited_at: '2021-11-01T00:00:00',
      active: false,
      scheduled_time: '09:15:00',
    },
    {
      id: 2,
      name: 'template 5',
      last_edited_by: 'Captain America',
      last_edited_at: '2021-10-31T00:00:00',
      active: true,
      scheduled_time: '09:15:00',
    },
    {
      id: 3,
      name: 'template 1',
      last_edited_by: 'Iron Man',
      last_edited_at: '2021-11-10T00:00:00',
      active: false,
      scheduled_time: null,
    },
    {
      id: 4,
      name: 'template 3',
      last_edited_by: 'Thor',
      last_edited_at: '2021-12-01T00:00:00',
      active: false,
      scheduled_time: '09:15:00',
    },
    {
      id: 5,
      name: 'template 4',
      last_edited_by: 'Hulk',
      last_edited_at: '2021-11-30T00:00:00',
      active: false,
      scheduled_time: null,
    },
  ];

  const mockTemplatesOrderByName = [
    {
      id: 3,
      name: 'template 1',
      last_edited_by: 'Iron Man',
      last_edited_at: '2021-11-10T00:00:00',
      active: false,
      scheduled_time: null,
    },
    {
      id: 1,
      name: 'template 2',
      last_edited_by: 'Iron Man',
      last_edited_at: '2021-11-01T00:00:00',
      active: false,
      scheduled_time: '09:15:00',
    },
    {
      id: 4,
      name: 'template 3',
      last_edited_by: 'Thor',
      last_edited_at: '2021-12-01T00:00:00',
      active: false,
      scheduled_time: '09:15:00',
    },
    {
      id: 5,
      name: 'template 4',
      last_edited_by: 'Hulk',
      last_edited_at: '2021-11-30T00:00:00',
      active: false,
      scheduled_time: null,
    },
    {
      id: 2,
      name: 'template 5',
      last_edited_by: 'Captain America',
      last_edited_at: '2021-10-31T00:00:00',
      active: true,
      scheduled_time: '09:15:00',
    },
  ];

  const defaultState = {
    templates: [],
    filters: {
      searchText: '',
      searchStatus: '',
      searchScheduled: '',
    },
    sorting: {
      column: 'name',
      direction: 'asc',
    },
  };

  describe('getSearchText selector', () => {
    it('can return the correct searchText', () => {
      const state = {
        filters: {
          searchText: 'abc123',
        },
      };
      expect(getSearchText(state)).toBe('abc123');
    });
  });

  describe('getSearchStatus selector', () => {
    it('can return the correct searchStatus', () => {
      const state = {
        filters: {
          searchStatus: 'active',
        },
      };
      expect(getSearchStatus(state)).toBe('active');
    });
  });

  describe('getSearchScheduled selector', () => {
    it('can return the correct searchScheduled', () => {
      const state = {
        filters: {
          searchScheduled: 'active',
        },
      };
      expect(getSearchScheduled(state)).toBe('active');
    });
  });

  describe('getSortingColumn selector', () => {
    it('can return the correct sorting column', () => {
      const state = {
        sorting: {
          column: 'name',
        },
      };
      expect(getSortingColumn(state)).toBe('name');
    });
  });

  describe('getSortingDirection selector', () => {
    it('can return the correct sorting direction', () => {
      const state = {
        sorting: {
          direction: 'asc',
        },
      };
      expect(getSortingDirection(state)).toBe('asc');
    });
  });

  describe('getTemplates selector', () => {
    it('returns the templates list ordered by name', () => {
      const state = {
        ...defaultState,
        templates: [...mockTemplates],
      };
      expect(getTemplates(state)).toEqual(mockTemplatesOrderByName);
    });

    it('returns the templates filtering search text by name', () => {
      const state = {
        ...defaultState,
        templates: [...mockTemplates],
        filters: {
          ...defaultState.filters,
          searchText: 'template 1',
        },
      };
      expect(getTemplates(state)).toEqual([
        {
          id: 3,
          name: 'template 1',
          last_edited_by: 'Iron Man',
          last_edited_at: '2021-11-10T00:00:00',
          active: false,
          scheduled_time: null,
        },
      ]);
    });

    it('returns the templates filtering search text by last_edited_by', () => {
      const state = {
        ...defaultState,
        templates: [...mockTemplates],
        filters: {
          ...defaultState.filters,
          searchText: 'cap',
        },
      };
      expect(getTemplates(state)).toEqual([
        {
          id: 2,
          name: 'template 5',
          last_edited_by: 'Captain America',
          last_edited_at: '2021-10-31T00:00:00',
          active: true,
          scheduled_time: '09:15:00',
        },
      ]);
    });

    it('returns the templates filtering by status', () => {
      const state = {
        ...defaultState,
        templates: [...mockTemplates],
        filters: {
          ...defaultState.filters,
          searchStatus: 'active',
        },
      };
      expect(getTemplates(state)).toEqual([
        {
          id: 2,
          name: 'template 5',
          last_edited_by: 'Captain America',
          last_edited_at: '2021-10-31T00:00:00',
          active: true,
          scheduled_time: '09:15:00',
        },
      ]);
    });

    it('returns the templates filtering by scheduled', () => {
      const state = {
        ...defaultState,
        templates: [...mockTemplates],
        filters: {
          ...defaultState.filters,
          searchScheduled: 'scheduled',
        },
      };
      expect(getTemplates(state)).toEqual([
        {
          id: 1,
          name: 'template 2',
          last_edited_by: 'Iron Man',
          last_edited_at: '2021-11-01T00:00:00',
          active: false,
          scheduled_time: '09:15:00',
        },
        {
          id: 4,
          name: 'template 3',
          last_edited_by: 'Thor',
          last_edited_at: '2021-12-01T00:00:00',
          active: false,
          scheduled_time: '09:15:00',
        },
        {
          id: 2,
          name: 'template 5',
          last_edited_by: 'Captain America',
          last_edited_at: '2021-10-31T00:00:00',
          active: true,
          scheduled_time: '09:15:00',
        },
      ]);
    });
  });
});
