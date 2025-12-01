import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '@kitman/playbook/providers';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { formMetaDataMockData } from '@kitman/modules/src/FormTemplates/shared/consts';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { useFetchFormTemplateQuery } from '@kitman/services/src/services/formTemplates';
import data from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/fetchFormTemplate';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { FormBuilderTranslated as FormBuilder } from '../index';

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useFetchFormTemplateQuery: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useEventTracking');
const trackEventMock = jest.fn();

describe('<FormBuilder />', () => {
  beforeEach(() => {
    useFetchFormTemplateQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: {},
    });

    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
    trackEventMock.mockClear();
  });

  const renderComponent = (props = {}, useGlobalStore = false) => {
    renderWithRedux(
      <MemoryRouter>
        <ThemeProvider>
          <FormBuilder {...props} />
        </ThemeProvider>
      </MemoryRouter>,
      {
        useGlobalStore,
        preloadedState: {
          [REDUCER_KEY]: { ...initialState, metaData: formMetaDataMockData },
        },
      }
    );
  };

  it('renders initial elements', () => {
    renderComponent();

    expect(screen.getByText(formMetaDataMockData.title)).toBeInTheDocument();
    expect(screen.getByText('Forms Overview')).toBeInTheDocument();
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders form template from BE response if formTemplateId is provided', () => {
    useFetchFormTemplateQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data,
    });

    const formTemplateId = 123;

    renderComponent({ formTemplateId }, true);

    expect(screen.getByText('Forms Overview')).toBeInTheDocument();
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /test form template/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/medical/i)).toBeInTheDocument();
    expect(screen.getByText(/juan Gumy-admin-eu/i)).toBeInTheDocument();

    expect(screen.queryAllByText(/attachment/i)).toHaveLength(2);
    expect(screen.getByDisplayValue(/boolean\?/i)).toBeInTheDocument();
  });

  it('renders error message if fetching form template fails', () => {
    useFetchFormTemplateQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
      data: undefined,
    });

    renderComponent({ formTemplateId: 123 });

    expect(screen.getByText('Form template not found')).toBeInTheDocument();
    expect(screen.getByText('Build')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeDisabled();
    expect(screen.getByText('Settings')).toBeDisabled();
  });

  it('navigates to preview tab and tracks event', async () => {
    const formTemplateId = 456;
    renderComponent({ formTemplateId }, true);

    const previewTab = screen.getByRole('tab', { name: 'Preview' });
    await userEvent.click(previewTab);
    expect(
      screen.getByRole('tab', { name: 'Preview', selected: true })
    ).toBeInTheDocument();
    expect(screen.getByRole('tabpanel', { name: 'Preview' })).toBeVisible();
    expect(
      screen.getByRole('tab', { name: 'Build', selected: false })
    ).toBeInTheDocument();
    expect(trackEventMock).toHaveBeenCalledTimes(1);
    expect(trackEventMock).toHaveBeenCalledWith(
      'Form Builder - Preview Tab Used',
      { formTemplateId }
    );
  });

  it('navigates to settings tab and tracks event', async () => {
    const formTemplateId = 456;
    renderComponent({ formTemplateId }, true);

    const settingsTab = screen.getByRole('tab', { name: 'Settings' });
    await userEvent.click(settingsTab);
    expect(
      screen.getByRole('tab', { name: 'Settings', selected: true })
    ).toBeInTheDocument();
    expect(screen.getByRole('tabpanel', { name: 'Settings' })).toBeVisible();
    expect(
      screen.getByRole('tab', { name: 'Build', selected: false })
    ).toBeInTheDocument();
    expect(trackEventMock).toHaveBeenCalledTimes(1);
    expect(trackEventMock).toHaveBeenCalledWith(
      'Form Builder - Settings Tab Used',
      { formTemplateId }
    );
  });
});
