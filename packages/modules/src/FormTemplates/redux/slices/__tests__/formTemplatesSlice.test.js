import {
  formTemplatesSlice,
  setCategoryFilter,
  toggleIsFormTemplateDrawerOpen,
  toggleIsScheduleDrawerOpen,
  setSearchQuery,
  setSelectedFormId,
  setSelectedFormName,
  toggleIsFormTemplateDeleteModalOpen,
  initialState,
  setSelectedFormTemplateId,
} from '../formTemplatesSlice';

describe('formTemplatesSlice', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(formTemplatesSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly update state on setCategoryFilter', () => {
    const newCategory = { name: 'Medical', id: 2 };
    const action = setCategoryFilter(newCategory);

    expect(formTemplatesSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      filters: {
        ...initialState.filters,
        category: newCategory.name,
        formCategoryId: newCategory.id,
      },
    });
  });

  it('should correctly update state on setSearchQuery', () => {
    const newSearchQuery = 'Charmander';
    const action = setSearchQuery(newSearchQuery);

    expect(formTemplatesSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      searchQuery: newSearchQuery,
    });
  });

  it('should correctly update state on toggleIsFormTemplateDrawerOpen', () => {
    const action = toggleIsFormTemplateDrawerOpen();

    expect(formTemplatesSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      isFormTemplateDrawerOpen: !initialState.isFormTemplateDrawerOpen,
    });
  });

  it('should correctly update state on toggleIsScheduleDrawerOpen', () => {
    const action = toggleIsScheduleDrawerOpen();

    expect(formTemplatesSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      isScheduleDrawerOpen: !initialState.isScheduleDrawerOpen,
    });
  });

  it('should correctly update state on setSelectedFormId', () => {
    const formId = 1;
    const action = setSelectedFormId(formId);

    expect(formTemplatesSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      selectedFormId: formId,
    });
  });

  it('should correctly update state on setSelectedFormTemplateId', () => {
    const formTemplateId = 1;
    const action = setSelectedFormTemplateId(formTemplateId);

    expect(formTemplatesSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      selectedFormTemplateId: formTemplateId,
    });
  });

  it('should correctly update state on setSelectedFormName', () => {
    const formName = 'New Form';
    const action = setSelectedFormName(formName);

    expect(formTemplatesSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      selectedFormName: formName,
    });
  });

  it('should correctly update state on toggleIsFormTemplateDeleteModalOpen', () => {
    const action = toggleIsFormTemplateDeleteModalOpen();

    expect(formTemplatesSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      isFormTemplateDeleteModalOpen:
        !initialState.isFormTemplateDeleteModalOpen,
    });
  });
});
