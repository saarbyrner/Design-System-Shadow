import { screen, act, waitFor, within } from '@testing-library/react';
import { server, rest } from '@kitman/services/src/mocks/server';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import Toasts from '@kitman/modules/src/Toasts';
import { data as mockClubPayment } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_club_payment';

import PaymentSection from '../PaymentSection';

describe('<PaymentSection />', () => {
  it('renders the payment details', async () => {
    await act(async () => {
      renderWithProviders(<PaymentSection />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('AppStatus|loading')).not.toBeInTheDocument();
    });

    const paymentInformationSection = screen.getByTestId('PaymentInformation');
    expect(paymentInformationSection).toHaveTextContent("Season: 23/'24");
    expect(paymentInformationSection).toHaveTextContent('Registrations: 1000');
    expect(paymentInformationSection).toHaveTextContent('Price: $50.00');
    expect(paymentInformationSection).toHaveTextContent(
      'Total Registrations Paid: 10'
    );
    expect(paymentInformationSection).toHaveTextContent(
      'Amount Paid: $1,000.00'
    );
    expect(paymentInformationSection).toHaveTextContent('Unpaid: $0.00');
    expect(paymentInformationSection).toHaveTextContent('Wallet: $10,000.00');

    const billingInformationSection = screen.getByTestId('BillingInformation');
    expect(billingInformationSection).toHaveTextContent('Name: John Doe');
    expect(billingInformationSection).toHaveTextContent(
      'Card No: *************1234'
    );
    expect(billingInformationSection).toHaveTextContent('Security Code: ***');
    expect(billingInformationSection).toHaveTextContent('Exp. Date: 12/30');
  });

  it('renders the updated payment details, when FF is turned on', async () => {
    window.featureFlags['league-ops-registration-module-v2'] = true;

    await act(async () => {
      renderWithProviders(<PaymentSection />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('AppStatus|loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('PaymentInformation')).toHaveTextContent(
      'Club wallet: $10,000.00'
    );
    expect(screen.getByTestId('Season')).toHaveTextContent(/Season: 23\/'24/);
    expect(screen.getByTestId('Total registrations')).toHaveTextContent(
      'Total registrations: 1000'
    );
    expect(screen.getByTestId('Amount paid')).toHaveTextContent(
      'Amount paid: $1,000.00'
    );
    expect(screen.getByTestId('Total registrations paid')).toHaveTextContent(
      'Total registrations paid: 10'
    );
  });

  it('deletes the saved payment method when clicking the delete button', async () => {
    await act(async () => {
      renderWithProviders(
        <>
          <PaymentSection />
          <Toasts />
        </>
      );
    });

    await waitFor(() => {
      expect(screen.queryByTestId('AppStatus|loading')).not.toBeInTheDocument();
    });

    const billingInformationSection = screen.getByTestId('BillingInformation');
    const deleteButton = within(billingInformationSection).getByRole('button');
    await userEvent.click(deleteButton);

    // Confirm deletion
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete', hidden: true })
    );

    await waitFor(() => {
      expect(screen.getByTestId('Toast')).toHaveTextContent(
        'Payment method deleted'
      );
    });
  });

  it('pays selected amount when clicking the pay button', async () => {
    await act(async () => {
      renderWithProviders(
        <>
          <PaymentSection />
          <Toasts />
        </>
      );
    });

    // The pay button is disabled until the user selects an amount
    expect(screen.getByTestId('PaymentForm|Subtotal')).toHaveTextContent(
      '$0.00'
    );
    expect(screen.getByRole('button', { name: 'Pay' })).toBeDisabled();

    // Select an amount
    await userEvent.type(
      screen.getByRole('spinbutton', { name: 'Amount' }),
      '100'
    );
    expect(screen.getByTestId('PaymentForm|Subtotal')).toHaveTextContent(
      '$5,000.00'
    );

    // Click the pay button
    await userEvent.click(screen.getByRole('button', { name: 'Pay' }));

    // Confirm deletion
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Pay', hidden: true })[1]
    );

    await waitFor(() => {
      expect(screen.getByTestId('Toast')).toHaveTextContent(
        'Payment successful'
      );
    });
  });

  it('save a payment method when filling in the card form', async () => {
    // We show the "add card" button only if no payment method is saved
    server.use(
      rest.get('/registration/payments/club_payment', (req, res, ctx) =>
        res(
          ctx.json({
            ...mockClubPayment,
            payment_method: undefined,
          })
        )
      )
    );

    await act(async () => {
      renderWithProviders(
        <>
          <PaymentSection />
          <Toasts />
        </>
      );
    });

    await userEvent.click(screen.getByRole('button', { name: 'Add a card' }));

    await waitFor(() => {
      expect(screen.queryByTestId('AppStatus|loading')).not.toBeInTheDocument();
    });

    expect(
      screen.getByTitle('Repay - Store Payment Method')
    ).toBeInTheDocument();
    // We cannot test the iframe contents, so we just check that the form has the correct URL
    expect(screen.getByTitle('Repay - Store Payment Method')).toHaveAttribute(
      'src',
      'https://kitmanlabs.sandbox.repay.io/checkout/#/checkout-form/1234'
    );
  });

  describe('permissions', () => {
    it('hides the add card button if the user does not have the registration-manage-payment permission', async () => {
      server.use(
        rest.get('/registration/payments/club_payment', (req, res, ctx) =>
          res(
            ctx.json({
              ...mockClubPayment,
              payment_method: undefined,
            })
          )
        ),
        rest.get('/ui/permissions', (req, res, ctx) =>
          res(
            ctx.json({
              registration: [
                'registration-view-payment',
                // 'registration-manage-payment', is disabled
                'registration-payment-authorisation',
              ],
            })
          )
        )
      );

      await act(async () => {
        renderWithProviders(<PaymentSection />);
      });

      expect(
        screen.queryByRole('button', { name: 'Add a card' })
      ).not.toBeInTheDocument();
    });

    it('hides the delete card button if the user does not have the registration-manage-payment permission', async () => {
      server.use(
        rest.get('/ui/permissions', (req, res, ctx) =>
          res(
            ctx.json({
              registration: [
                'registration-view-payment',
                // 'registration-manage-payment', is disabled
                'registration-payment-authorisation',
              ],
            })
          )
        )
      );

      await act(async () => {
        renderWithProviders(<PaymentSection />);
      });

      const billingInformationSection =
        screen.getByTestId('BillingInformation');
      expect(
        within(billingInformationSection).queryByRole('button')
      ).not.toBeInTheDocument();
    });

    it('hides the pay button if the user does not have the registration-payment-authorisation permission', async () => {
      server.use(
        rest.get('/ui/permissions', (req, res, ctx) =>
          res(
            ctx.json({
              registration: [
                'registration-view-payment',
                'registration-manage-payment',
                // 'registration-payment-authorisation', is disabled
              ],
            })
          )
        )
      );

      await act(async () => {
        renderWithProviders(<PaymentSection />);
      });

      expect(
        screen.queryByRole('button', { name: 'Pay' })
      ).not.toBeInTheDocument();
    });
  });

  /*
   * We cannot test the validation on negative and decimal values due to this bug:
   * https://github.com/testing-library/user-event/issues/336#issuecomment-1423153727
   * re-introduced at @testing-library/user-event version 14.4.3
   */
  it('sets the input value to 0 and disables the form when the user empties the field', async () => {
    let paymentContainer;
    await act(async () => {
      const { container } = renderWithProviders(
        <>
          <PaymentSection />
          <Toasts />
        </>
      );
      paymentContainer = container;
    });

    // The pay button is disabled until the user selects a correct amount
    expect(screen.getByTestId('PaymentForm|Subtotal')).toHaveTextContent(
      '$0.00'
    );
    expect(screen.getByRole('button', { name: 'Pay' })).toBeDisabled();

    // Clear the field
    await userEvent.clear(screen.getByRole('spinbutton', { name: 'Amount' }));
    screen.getByRole('spinbutton', { name: 'Amount' }).blur();

    expect(screen.getByRole('spinbutton', { name: 'Amount' })).toHaveValue(0);
    expect(screen.getByTestId('PaymentForm|Subtotal')).toHaveTextContent(
      '$0.00'
    );
    expect(screen.getByRole('button', { name: 'Pay' })).toBeDisabled();
    expect(
      paymentContainer.getElementsByClassName('inputText--invalid')
    ).toHaveLength(1);

    // Select a valid amount enables the form
    await userEvent.type(
      screen.getByRole('spinbutton', { name: 'Amount' }),
      '100'
    );
    expect(screen.getByTestId('PaymentForm|Subtotal')).toHaveTextContent(
      '$5,000.00'
    );
    expect(screen.getByRole('button', { name: 'Pay' })).toBeEnabled();
    expect(
      paymentContainer.getElementsByClassName('inputText--invalid')
    ).toHaveLength(0);
  });
});
