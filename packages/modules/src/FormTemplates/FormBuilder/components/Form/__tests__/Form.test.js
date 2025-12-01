import { screen } from '@testing-library/react';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import Form from '../index';
import { getHeaderTranslations } from '../Menu/utils/helpers';

describe('<Form />', () => {
  const translations = getHeaderTranslations();

  const renderComponent = (customState = initialState) => {
    renderWithRedux(<Form />, {
      useGlobalStore: false,
      preloadedState: { [REDUCER_KEY]: customState },
    });
  };

  it('should render the form properly', () => {
    renderComponent();

    expect(screen.getByText(translations.title)).toBeInTheDocument();
    expect(screen.getAllByText('Section 1').length).toBe(2); // one for the menu, one for the content
    expect(screen.queryByText('Kitman Rugby Club')).not.toBeInTheDocument(); // check theres no branding header when config is null
  });

  it('should render the form branding header if config exists', () => {
    const defaultsHeaderData = {
      header: {
        enabled: true,
        image: {
          hidden: false,
          current_organisation_logo: false,
          attachment_id: 1234,
        },
        text: {
          hidden: false,
          content: 'Kitman Rugby Club',
          color: '#000000',
        },
        color: {
          primary: '#ffffff',
        },
        layout: 'left',
      },
    };

    renderComponent({
      ...initialState,
      structure: {
        ...initialState.structure,
        config: { header: defaultsHeaderData.header },
      },
    });

    expect(screen.getByText('Kitman Rugby Club')).toBeInTheDocument();
  });
});
