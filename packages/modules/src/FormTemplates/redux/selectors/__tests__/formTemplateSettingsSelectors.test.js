import {
  initialState,
  REDUCER_KEY,
} from '../../slices/formTemplateSettingsSlice';
import {
  getFormTemplateSettingsFilters,
  getFormCategoryDrawerMode,
  getSelectedFormCategoryId,
  getIsFormCategoryDrawerOpen,
} from '../formTemplateSettingsSelectors';

const MOCK_STATE = {
  [REDUCER_KEY]: initialState,
};

describe('formTemplateSettingsSelectors', () => {
  it('should get the filters', () => {
    expect(getFormTemplateSettingsFilters(MOCK_STATE)).toBe(
      initialState.filters
    );
  });

  it('should get the form Category Drawer Mode', () => {
    expect(getFormCategoryDrawerMode(MOCK_STATE)).toBe(
      initialState.formCategoryDrawerMode
    );
  });

  it('should get getSelectedFormCategoryId', () => {
    expect(getSelectedFormCategoryId(MOCK_STATE)).toBe(
      initialState.selectedFormCategoryId
    );
  });

  it('should get getIsFormCategoryDrawerOpen', () => {
    expect(getIsFormCategoryDrawerOpen(MOCK_STATE)).toBe(
      initialState.isFormCategoryDrawerOpen
    );
  });
});
