import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { StockListContextProvider } from '@kitman/modules/src/StockManagement/src/contexts/StockListContextProvider';
import { server } from '@kitman/services/src/mocks/server';
import AddStockSidePanel from '..';

jest.mock('@kitman/components/src/DatePicker');

const props = {
  t: i18nextTranslateStub(),
  onSaveStock: jest.fn(),
};

describe('<AddStockSidePanel/>', () => {
  it('renders correct default sidepanel', async () => {
    render(<AddStockSidePanel {...props} />);
    await screen.findByText('Add Stock');

    expect(screen.getByText('Add Stock')).toBeInTheDocument();

    // Close & Save buttons
    const buttons = document.querySelectorAll('button');
    expect(buttons).toHaveLength(2);

    expect(screen.getByText('Brand name / drug')).toBeInTheDocument();
    expect(screen.getByText('Lot number')).toBeInTheDocument();
    expect(await screen.findByLabelText('Exp. date')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();

    expect(screen.getByTestId('StockManagement|Actions')).toBeInTheDocument();

    expect(buttons[1]).toHaveTextContent('Save');
  });

  it('implements basic form validation before sending off req', async () => {
    render(<AddStockSidePanel {...props} />);
    await screen.findByText('Add Stock');

    const buttons = document.querySelectorAll('button');
    expect(buttons[1]).toHaveTextContent('Save');

    await userEvent.click(buttons[1]);

    expect(
      document.getElementsByClassName('kitmanReactSelect--invalid').length
    ).toBe(1);

    expect(
      document.getElementsByClassName('InputNumeric__inputContainer--invalid')
        .length
    ).toBe(1);

    expect(document.getElementsByClassName('inputText--invalid').length).toBe(
      1
    ); // NOTE: the datepicker would be invalid too had I not mocked it
  });

  describe('[FEATURE FLAG] medications-general-availability', () => {
    beforeEach(() => {
      window.featureFlags['medications-general-availability'] = true;
    });
    afterEach(() => {
      window.featureFlags['medications-general-availability'] = false;
    });

    it('displays and submits NHS drugs from searchDrugs service', async () => {
      render(
        <StockListContextProvider>
          <AddStockSidePanel
            {...props}
            medicationSourceListName="nhs_dmd_drugs"
          />
        </StockListContextProvider>
      );
      await screen.findByText('Add Stock');

      // NOTE: Cannot use getByLabelText as AsyncSelect is not using aria-labelledby
      const drugSelect = screen.getAllByRole('textbox')[0];
      selectEvent.openMenu(drugSelect);
      await userEvent.type(drugSelect, 'NHS_Test2', [{ delay: 2 }]);
      await selectEvent.select(drugSelect, 'NHS_Test2', {
        container: document.body,
      });

      const expirationDatePicker = screen.getByLabelText('Exp. date');
      await userEvent.click(expirationDatePicker);
      await fireEvent.change(expirationDatePicker, {
        target: { value: '29 Oct, 2024' },
      });

      const numericInput = screen.getByRole('spinbutton', { hidden: true });
      await userEvent.type(numericInput, '20');

      // Lot number InputTextField
      const lotInput = screen.getByLabelText('Lot number');
      await userEvent.type(lotInput, '1');

      // Could not get button by role, even with hidden true
      const buttons = document.querySelectorAll('button');
      expect(buttons[1]).toHaveTextContent('Save');

      const saveButton = buttons[1];
      expect(saveButton).toBeEnabled();

      const requestSpy = jest.fn();
      server.events.on('request:start', requestSpy);
      await userEvent.click(saveButton);

      expect(props.onSaveStock).toHaveBeenCalled();
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: new URL('http://localhost/medical/stocks/add'),
          body: {
            drug: {
              type: 'Emr::Private::Models::NhsDmdDrug',
              id: 2,
            },
            lot_number: '1',
            expiration_date: '2024-10-29T00:00:00.000Z',
            quantity: '20',
          },
        })
      );
    });
  });
});
