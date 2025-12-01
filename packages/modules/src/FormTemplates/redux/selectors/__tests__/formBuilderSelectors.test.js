import { initialState } from '../../slices/utils/consts';
import { REDUCER_KEY } from '../../slices/formBuilderSlice';
import {
  getCurrentMenuGroupIndex,
  getCurrentMenuItemIndex,
  getFormMenu,
  getFormMetaData,
  getQuestionByIndex,
  getOriginalFormStructure,
  getShowFormHeaderModal,
  getFormHeaderBrandingConfig,
} from '../formBuilderSelectors';

const MOCK_STATE = {
  [REDUCER_KEY]: initialState,
};

const brandingHeaderData = {
  enabled: true,
  image: {
    hidden: false,
    attachment: {
      current_organisations_logo: false,
      id: 12345,
    },
  },
  text: {
    hidden: false,
    content: 'some text content',
    color: '#000000',
  },
  colour: {
    primary: '#123abc',
  },
  layout: 'left',
};

describe('formBuilderSelectors', () => {
  it('should get the current menu group index', () => {
    expect(getCurrentMenuGroupIndex(MOCK_STATE)).toBe(
      initialState.currentMenuGroupIndex
    );
  });

  it('should get the current menu item index', () => {
    expect(getCurrentMenuItemIndex(MOCK_STATE)).toBe(
      initialState.currentMenuItemIndex
    );
  });

  it('should get the form menu', () => {
    expect(getFormMenu(MOCK_STATE)).toBe(
      initialState.structure.form_elements[0].form_elements[0].form_elements
    );
  });
  it('should get the form meta data', () => {
    expect(getFormMetaData(MOCK_STATE)).toBe(initialState.metaData);
  });

  it('should get the original form template structure', () => {
    expect(getOriginalFormStructure(MOCK_STATE)).toBe(
      initialState.originalStructure
    );
  });

  it('should get the question by index', () => {
    expect(getQuestionByIndex(MOCK_STATE, 0)).toBe(
      initialState.structure.form_elements[0].form_elements[0].form_elements[
        initialState.currentMenuGroupIndex
      ].form_elements[initialState.currentMenuItemIndex].form_elements[0]
    );
  });

  it('should get showFormHeaderModal', () => {
    expect(getShowFormHeaderModal(MOCK_STATE)).toBe(false);
  });

  it('should get getFormHeaderBrandingConfig', () => {
    expect(
      getFormHeaderBrandingConfig({
        [REDUCER_KEY]: {
          ...initialState,
          structure: {
            ...initialState.structure,
            config: { header: brandingHeaderData },
          },
        },
      })
    ).toBe(brandingHeaderData);
  });
});
