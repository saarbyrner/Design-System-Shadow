import { initialState, REDUCER_KEY } from '../../slices/formTemplatesSlice';
import {
  getFilterCategory,
  getSearchQuery,
  getIsFormTemplateDrawerOpen,
  getIsScheduleDrawerOpen,
  getSelectedFormId,
  getSelectedFormName,
  getIsAssignAthletesDrawerOpen,
  getIsAssignFreeAgentsDrawerOpen,
  getFormTemplateDrawerMode,
  getIsFormTemplateDeleteModalOpen,
  getSelectedFormTemplateId,
} from '../formTemplateSelectors';

const MOCK_STATE = {
  [REDUCER_KEY]: initialState,
};

describe('formTemplatesSelectors', () => {
  it('should get the category', () => {
    expect(getFilterCategory(MOCK_STATE)).toBe(initialState.filters.category);
  });

  it('should get the search query', () => {
    expect(getSearchQuery(MOCK_STATE)).toBe(initialState.searchQuery);
  });
  it('should get isFormTemplateDrawerOpen', () => {
    expect(getIsFormTemplateDrawerOpen(MOCK_STATE)).toBe(
      initialState.isFormTemplateDrawerOpen
    );
  });

  it('should get getIsScheduleDrawerOpen', () => {
    expect(getIsScheduleDrawerOpen(MOCK_STATE)).toBe(
      initialState.isScheduleDrawerOpen
    );
  });

  it('should get getIsAssignAthletesDrawerOpen', () => {
    expect(getIsAssignAthletesDrawerOpen(MOCK_STATE)).toBe(
      initialState.isAssignAthletesDrawerOpen
    );
  });

  it('should get getIsAssignFreeAgentsDrawerOpen', () => {
    expect(getIsAssignFreeAgentsDrawerOpen(MOCK_STATE)).toBe(
      initialState.isAssignFreeAgentsDrawerOpen
    );
  });

  it('should get getSelectedFormId', () => {
    expect(getSelectedFormId(MOCK_STATE)).toBe(initialState.selectedFormId);
  });

  it('should get getSelectedFormTemplateId', () => {
    expect(getSelectedFormTemplateId(MOCK_STATE)).toBe(
      initialState.selectedFormTemplateId
    );
  });

  it('should get getSelectedFormName', () => {
    expect(getSelectedFormName(MOCK_STATE)).toBe(initialState.selectedFormName);
  });

  it('should get getFormTemplateDrawerMode', () => {
    expect(getFormTemplateDrawerMode(MOCK_STATE)).toBe(
      initialState.formTemplateDrawerMode
    );
  });

  it('should get getIsFormTemplateDeleteModalOpen', () => {
    expect(getIsFormTemplateDeleteModalOpen(MOCK_STATE)).toBe(
      initialState.isFormTemplateDeleteModalOpen
    );
  });
});
