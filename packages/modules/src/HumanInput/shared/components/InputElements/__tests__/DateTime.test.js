import { render, screen } from '@testing-library/react';
import { data } from '@kitman/services/src/mocks/handlers/getCurrentOrganisation';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import DateTime from '@kitman/modules/src/HumanInput/shared/components/InputElements/DateTime';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import userEvent from '@testing-library/user-event';

const props = {
  value: '2023-10-06T00:00:00+01:00',
  onChange: jest.fn(),
};

describe('<DateTime/>', () => {
  const MOCK_ELEMENT = {
    id: 23206,
    element_type: 'Forms::Elements::Inputs::DateTime',
    config: {
      type: 'date',
      text: 'Date of birth',
      data_point: false,
      element_id: 'date_of_birth',
      custom_params: {
        internal_source: {
          object: 'user',
          field: 'date_of_birth',
        },
        readonly: false,
      },
      repeatable: false,
      optional: false,
    },
    visible: true,
    order: 4,
    form_elements: [],
  };

  afterEach(() => {
    MOCK_ELEMENT.config.custom_params.readonly = false;
    MOCK_ELEMENT.config.type = 'date';
  });

  it('renders Date Picker', () => {
    render(
      <LocalizationProvider>
        <DateTime {...props} element={MOCK_ELEMENT} />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Date of birth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10/05/2023')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of birth')).not.toHaveAttribute(
      'readOnly'
    );
  });

  it('renders Date Picker as read only', () => {
    MOCK_ELEMENT.config.custom_params.readonly = true;

    render(
      <LocalizationProvider>
        <DateTime {...props} element={MOCK_ELEMENT} isDisabled />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Date of birth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10/05/2023')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of birth')).toHaveAttribute('readOnly');
  });

  it('renders Date Picker in en-GB format', () => {
    render(
      <LocalizationProvider>
        <MockedOrganisationContextProvider
          organisationContext={{ organisation: { ...data, locale: 'en-GB' } }}
        >
          <DateTime {...props} element={MOCK_ELEMENT} />
        </MockedOrganisationContextProvider>
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Date of birth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('05/10/2023')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of birth')).not.toHaveAttribute(
      'readOnly'
    );
  });

  it('renders Date Picker with min date', async () => {
    const minDateElement = {
      ...MOCK_ELEMENT,
      config: {
        ...MOCK_ELEMENT.config,
        min: '2023-10-04T13:42:50Z',
      },
    };

    render(
      <LocalizationProvider>
        <DateTime {...props} element={minDateElement} />
      </LocalizationProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByTestId('CalendarIcon'));
    expect(screen.getByRole('gridcell', { name: '7' })).toBeEnabled();
    expect(screen.getByRole('gridcell', { name: '2' })).toBeDisabled();
  });

  it('renders Date Picker with max date', async () => {
    const maxDateElement = {
      ...MOCK_ELEMENT,
      config: {
        ...MOCK_ELEMENT.config,
        max: '2023-10-06T13:42:50Z',
      },
    };

    render(
      <LocalizationProvider>
        <DateTime {...props} element={maxDateElement} />
      </LocalizationProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByTestId('CalendarIcon'));
    expect(screen.getByRole('gridcell', { name: '8' })).toBeDisabled();
    expect(screen.getByRole('gridcell', { name: '3' })).toBeEnabled();
  });

  it('renders Date Picker both the min and max date restriction', async () => {
    const maxDateElement = {
      ...MOCK_ELEMENT,
      config: {
        ...MOCK_ELEMENT.config,
        min: '2023-10-03T13:42:50Z',
        max: '2023-10-06T13:42:50Z',
      },
    };

    render(
      <LocalizationProvider>
        <DateTime {...props} element={maxDateElement} />
      </LocalizationProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByTestId('CalendarIcon'));
    expect(screen.getByRole('gridcell', { name: '8' })).toBeDisabled();
    expect(screen.getByRole('gridcell', { name: '4' })).toBeEnabled();
    expect(screen.getByRole('gridcell', { name: '1' })).toBeDisabled();
  });

  it('renders Time Picker', () => {
    MOCK_ELEMENT.config.type = 'time';
    MOCK_ELEMENT.config.text = 'Time of birth';

    render(
      <LocalizationProvider>
        <DateTime {...props} element={MOCK_ELEMENT} />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Time of birth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11:00 PM')).toBeInTheDocument();
    expect(screen.getByLabelText('Time of birth')).not.toHaveAttribute(
      'readOnly'
    );
  });

  it('renders Time Picker as read only', () => {
    MOCK_ELEMENT.config.type = 'time';
    MOCK_ELEMENT.config.text = 'Time of birth';
    MOCK_ELEMENT.config.custom_params.readonly = true;

    render(
      <LocalizationProvider>
        <DateTime {...props} element={MOCK_ELEMENT} isDisabled />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Time of birth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11:00 PM')).toBeInTheDocument();
    expect(screen.getByLabelText('Time of birth')).toHaveAttribute('readOnly');
  });

  it('renders Date Time Picker', () => {
    MOCK_ELEMENT.config.type = 'date_time';
    MOCK_ELEMENT.config.text = 'Date and time of birth';

    render(
      <LocalizationProvider>
        <DateTime {...props} element={MOCK_ELEMENT} />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Date and time of birth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10/05/2023 11:00 PM')).toBeInTheDocument();
    expect(screen.getByLabelText('Date and time of birth')).not.toHaveAttribute(
      'readOnly'
    );
  });

  it('renders Date Time Picker in read only', () => {
    MOCK_ELEMENT.config.type = 'date_time';
    MOCK_ELEMENT.config.text = 'Date and time of birth';
    MOCK_ELEMENT.config.custom_params.readonly = true;

    render(
      <LocalizationProvider>
        <DateTime {...props} element={MOCK_ELEMENT} isDisabled />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Date and time of birth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10/05/2023 11:00 PM')).toBeInTheDocument();
    expect(screen.getByLabelText('Date and time of birth')).toHaveAttribute(
      'readOnly'
    );
  });

  it('renders Month and Year Picker', () => {
    MOCK_ELEMENT.config.type = 'month_year';
    MOCK_ELEMENT.config.text = 'Month and Year of birth';

    render(
      <LocalizationProvider>
        <DateTime {...props} element={MOCK_ELEMENT} />
      </LocalizationProvider>
    );

    expect(
      screen.getByLabelText('Month and Year of birth')
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('October 2023')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Month and Year of birth')
    ).not.toHaveAttribute('readOnly');
  });

  it('renders Month and Year Picker as read only', () => {
    MOCK_ELEMENT.config.type = 'month_year';
    MOCK_ELEMENT.config.text = 'Month and Year of birth';
    MOCK_ELEMENT.config.custom_params.readonly = true;

    render(
      <LocalizationProvider>
        <DateTime {...props} element={MOCK_ELEMENT} isDisabled />
      </LocalizationProvider>
    );

    expect(
      screen.getByLabelText('Month and Year of birth')
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('October 2023')).toBeInTheDocument();
    expect(screen.getByLabelText('Month and Year of birth')).toHaveAttribute(
      'readOnly'
    );
  });

  it('renders Year Picker', () => {
    MOCK_ELEMENT.config.type = 'year';
    MOCK_ELEMENT.config.text = 'Year of birth';

    render(
      <LocalizationProvider>
        <DateTime {...props} element={MOCK_ELEMENT} />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Year of birth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2023')).toBeInTheDocument();
    expect(screen.getByLabelText('Year of birth')).not.toHaveAttribute(
      'readOnly'
    );
  });

  it('renders Year Picker as read only', () => {
    MOCK_ELEMENT.config.type = 'year';
    MOCK_ELEMENT.config.text = 'Year of birth';
    MOCK_ELEMENT.config.custom_params.readonly = true;

    render(
      <LocalizationProvider>
        <DateTime {...props} element={MOCK_ELEMENT} isDisabled />
      </LocalizationProvider>
    );

    expect(screen.getByLabelText('Year of birth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2023')).toBeInTheDocument();
    expect(screen.getByLabelText('Year of birth')).toHaveAttribute('readOnly');
  });
});
