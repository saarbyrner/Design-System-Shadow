import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';

import { FormDocumentUploaderTranslated as FormDocumentUploader } from '..';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  toasts: [],
});

const i18nT = i18nextTranslateStub();

const props = {
  t: i18nT,
  exampleFile: {
    filename: 'Test',
  },
  files: [],
  setFiles: jest.fn(),
};

describe('<FormDocumentUploader/>', () => {
  it('renders <FormDocumentUploader/>', () => {
    render(
      <Provider store={defaultStore}>
        <FormDocumentUploader {...props} />
      </Provider>
    );
    expect(
      screen.getByTestId('RegistrationForm|FormDocumentUploader')
    ).toBeInTheDocument();
  });

  it('renders title if prop is passed', () => {
    render(
      <Provider store={defaultStore}>
        <FormDocumentUploader {...props} title="Title" />
      </Provider>
    );
    expect(screen.getByText(/Title/i)).toBeInTheDocument();
  });

  it('renders description if prop is passed', () => {
    render(
      <Provider store={defaultStore}>
        <FormDocumentUploader {...props} description="Description" />
      </Provider>
    );
    expect(screen.getByText(/Description/i)).toBeInTheDocument();
  });
});
