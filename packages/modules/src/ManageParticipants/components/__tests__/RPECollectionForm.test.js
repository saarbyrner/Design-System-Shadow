import { render, screen } from '@testing-library/react';

import {
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';

import RPECollectionForm from '../RPECollectionForm';

describe('RPECollectionForm', () => {
  const defaultProps = {
    event: {
      id: 12,
      name: 'Event name',
      rpe_collection_kiosk: false,
      rpe_collection_athlete: false,
      mass_input: null,
    },
    onRpeCollectionAthleteChange: jest.fn(),
    onRpeCollectionKioskChange: jest.fn(),
    onMassInputChange: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders an Athlete App checkbox and it is checked', () => {
    render(
      <RPECollectionForm
        {...defaultProps}
        event={{ ...defaultProps.event, rpe_collection_athlete: true }}
      />
    );

    expect(screen.getByLabelText('Athlete App')).toBeInTheDocument();
    expect(screen.getByLabelText('Athlete App')).toBeChecked();
  });

  it('calls onRpeCollectionAthleteChange when checking the Athlete App checkbox', async () => {
    const { user } = renderWithUserEventSetup(
      <RPECollectionForm {...defaultProps} />
    );

    await user.click(screen.getByLabelText('Athlete App'));
    expect(defaultProps.onRpeCollectionAthleteChange).toHaveBeenCalledWith(
      true
    );
  });

  it('renders a Kiosk App checkbox and it is checked', () => {
    render(
      <RPECollectionForm
        {...defaultProps}
        event={{ ...defaultProps.event, rpe_collection_kiosk: true }}
      />
    );

    expect(screen.getByLabelText('Kiosk App')).toBeInTheDocument();
    expect(screen.getByLabelText('Kiosk App')).toBeChecked();
  });

  it('calls onRpeCollectionKioskChange when checking the Kiosk App checkbox', async () => {
    const { user } = renderWithUserEventSetup(
      <RPECollectionForm {...defaultProps} />
    );

    await user.click(screen.getByLabelText('Kiosk App'));
    expect(defaultProps.onRpeCollectionKioskChange).toHaveBeenCalledWith(true);
  });

  it('disables the kiosk type section when rpe_collection_kiosk is false', () => {
    render(<RPECollectionForm {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: 'Kiosk View' }).parentElement
    ).toHaveClass('rpeCollectionForm__kioskSection--disabled');

    const kioskViewRadio = screen.getByText('Kiosk View', {
      selector: '.inputRadio__label',
    });
    expect(kioskViewRadio.parentElement).toHaveClass('inputRadio--disabled');

    const listViewRadio = screen.getByText('List View', {
      selector: '.inputRadio__label',
    });
    expect(listViewRadio.parentElement).toHaveClass('inputRadio--disabled');
  });

  describe('when rpe_collection_kiosk is true', () => {
    const propsWithKiosk = {
      ...defaultProps,
      event: {
        ...defaultProps.event,
        rpe_collection_kiosk: true,
      },
    };

    it('calls onMassInputChange with false when clicking the Kiosk View radio button', async () => {
      const { user } = renderWithUserEventSetup(
        <RPECollectionForm {...propsWithKiosk} />
      );

      await user.click(
        screen.getByText('Kiosk View', { selector: '.inputRadio__label' })
      );
      expect(defaultProps.onMassInputChange).toHaveBeenCalledWith(false);
    });

    it('calls onMassInputChange with true when clicking the List View radio button', async () => {
      const { user } = renderWithUserEventSetup(
        <RPECollectionForm {...propsWithKiosk} />
      );

      await user.click(
        screen.getByText('List View', { selector: '.inputRadio__label' })
      );
      expect(defaultProps.onMassInputChange).toHaveBeenCalledWith(true);
    });
  });
});
