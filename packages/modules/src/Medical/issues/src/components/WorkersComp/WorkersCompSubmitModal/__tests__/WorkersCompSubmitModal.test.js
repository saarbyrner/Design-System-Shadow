import {
  screen,
  render,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { submitWorkersComp } from '@kitman/services';
import WorkersCompSubmitModal from '..';

jest.mock('@kitman/services', () => ({
  ...jest.requireActual('@kitman/services'),
  submitWorkersComp: jest.fn(),
}));

describe('<WorkersCompSubmitModal />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const getMockStore = (isModalOpen = true) =>
    storeFake({
      addWorkersCompSidePanel: {
        submitModal: {
          isOpen: isModalOpen,
        },
      },
    });

  const props = {
    t: i18nextTranslateStub(),
  };

  it('should render as expected if isOpen is true', () => {
    render(
      <Provider store={getMockStore()}>
        <WorkersCompSubmitModal {...props} />
      </Provider>
    );

    expect(screen.getByText("Submit workers' comp form")).toBeInTheDocument();
    expect(
      screen.getByText(
        'By clicking the submit button, you will send the workers comp form to the insurance company. Please make sure you have accurately filled in and completed everything in the form before submitting.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should not render content if isOpen is false', () => {
    const component = render(
      <Provider store={getMockStore(false)}>
        <WorkersCompSubmitModal {...props} />
      </Provider>
    );

    expect(component).toMatchSnapshot();
  });

  it('should render loading spinner on submit button on click of button', () => {
    render(
      <Provider store={getMockStore()}>
        <WorkersCompSubmitModal {...props} />
      </Provider>
    );

    act(() => {
      submitWorkersComp.mockResolvedValue('working');
      fireEvent.click(screen.getByText('Submit'));
    });

    expect(screen.getByTestId('LoadingSpinner')).toBeInTheDocument();
  });

  it('should render <AppStatus /> if submit call fails', async () => {
    render(
      <Provider store={getMockStore()}>
        <WorkersCompSubmitModal {...props} />
      </Provider>
    );

    act(() => {
      submitWorkersComp.mockRejectedValue('not working');
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });
  });

  describe('[feature flag] pm-mls-emr-demo-froi', () => {
    beforeEach(() => {
      window.featureFlags['pm-mls-emr-demo-froi'] = true;
    });

    afterEach(() => {
      window.featureFlags['pm-mls-emr-demo-froi'] = false;
    });

    it('should render as expected if isOpen is true', () => {
      render(
        <Provider store={getMockStore()}>
          <WorkersCompSubmitModal {...props} />
        </Provider>
      );

      expect(screen.getByText('Submit FROI form')).toBeInTheDocument();
      expect(
        screen.getByText(
          'By clicking the submit button, you will send the FROI form. Please make sure you have accurately filled in and completed everything in the form before submitting.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });
});
