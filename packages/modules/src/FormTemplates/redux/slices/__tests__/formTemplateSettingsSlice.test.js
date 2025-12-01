import {
  formTemplateSettingsReducer,
  setProductAreaFilter,
  setSearchQueryFilter,
  resetFormTemplateSettingsFilters,
  setIsFormCategoryDrawerOpen,
  setFormCategoryDrawerMode,
  setSelectedFormCategoryId,
  initialState,
} from '../formTemplateSettingsSlice';

describe('formTemplateSettingsSlice', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(formTemplateSettingsReducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on setProductAreaFilter', () => {
    const newProductArea = 'Strength';
    const action = setProductAreaFilter(newProductArea);

    expect(formTemplateSettingsReducer(initialState, action)).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        productArea: newProductArea,
      },
    });
  });

  it('should correctly update state on setSearchQueryFilter', () => {
    const newSearchQuery = 'Test Query';
    const action = setSearchQueryFilter(newSearchQuery);

    expect(formTemplateSettingsReducer(initialState, action)).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        searchQuery: newSearchQuery,
      },
    });
  });

  it('should correctly reset state on resetFormTemplateSettingsFilters', () => {
    const modifiedState = {
      ...initialState,
      filters: {
        productArea: 'Modified Area',
        searchQuery: 'Modified Query',
      },
      selectedFormCategoryId: 123,
      isFormCategoryDrawerOpen: true,
      formCategoryDrawerMode: 'EDIT',
    };
    const action = resetFormTemplateSettingsFilters();

    expect(formTemplateSettingsReducer(modifiedState, action)).toEqual(
      // Only filters should be reset, other parts of state remain
      {
        ...initialState,
        selectedFormCategoryId: 123,
        isFormCategoryDrawerOpen: true,
        formCategoryDrawerMode: 'EDIT',
      }
    );
  });

  it('should correctly update state on setIsFormCategoryDrawerOpen', () => {
    const isOpen = true;
    const action = setIsFormCategoryDrawerOpen(isOpen);

    expect(formTemplateSettingsReducer(initialState, action)).toEqual({
      ...initialState,
      isFormCategoryDrawerOpen: isOpen,
    });
  });

  it('should correctly update state on setFormCategoryDrawerMode', () => {
    const mode = 'EDIT';
    const action = setFormCategoryDrawerMode(mode);

    expect(formTemplateSettingsReducer(initialState, action)).toEqual({
      ...initialState,
      formCategoryDrawerMode: mode,
    });
  });

  it('should correctly update state on setSelectedFormCategoryId', () => {
    const categoryId = 123;
    const action = setSelectedFormCategoryId(categoryId);

    expect(formTemplateSettingsReducer(initialState, action)).toEqual({
      ...initialState,
      selectedFormCategoryId: categoryId,
    });
  });
});
