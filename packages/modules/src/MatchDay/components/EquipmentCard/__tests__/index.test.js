import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import kitsMock from '@kitman/services/src/services/kitMatrix/searchKitMatrices/mock';
import { transformKitMatrices } from '@kitman/modules/src/KitMatrix/shared/utils';
import EquipmentCard from '..';

describe('EquipmentCard', () => {
  const onSave = jest.fn();

  const selectedEquipment = {
    type: 'player',
    organisation: {
      id: 1267,
      name: 'KL Galaxy',
      logo_full_path:
        'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
    },
    name: 'Test',
    color: 'c43636',
    jersey: {
      colorId: 1,
      colorName: 'Red',
      image: {
        url: 'https://jersey.com',
        name: 'Hyades_1209462.png',
        type: 'image/png',
      },
    },
    shorts: {
      colorId: 1,
      colorName: 'Blue',
      image: {
        url: 'https://shorts.com',
        name: 'NGC_2808_963357.png',
        type: 'image/png',
      },
    },
    socks: {
      colorId: 1,
      colorName: 'Green',
      image: {
        url: 'https://socks.com',
        name: 'Coma_963358.png',
        type: 'image/png',
      },
    },
    id: 1,
    games_count: 0,
    division: {
      id: 1,
      name: 'KLS Next',
    },
    status: '',
  };

  const defaultProps = {
    icon: 'icon.png',
    teamName: 'Team A',
    equipments: transformKitMatrices(kitsMock.kit_matrices),
    selectedEquipment: null,
    playerType: 'player',
    onSave,
  };

  const renderComponent = (props = {}) => {
    return render(
      <LocalizationProvider>
        <EquipmentCard {...defaultProps} isEditable {...props} />
      </LocalizationProvider>
    );
  };

  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByAltText('Team A team flag')).toBeInTheDocument();
    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('No kit selected')).toBeInTheDocument();
  });

  it('renders with selected equipement correctly', () => {
    renderComponent({ selectedEquipment });

    expect(screen.getByAltText('Team A team flag')).toBeInTheDocument();
    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();

    [('jersey', 'shorts', 'socks')].forEach((equipmentName) => {
      expect(
        screen.getByAltText(`Team A ${equipmentName} equipment`)
      ).toHaveAttribute('src', `https://${equipmentName}.com`);
    });
  });

  it('show the edit view when Edit button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByTestId('EditOutlinedIcon'));
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('EditOutlinedIcon')).not.toBeInTheDocument();
    expect(screen.getByText('No kit selected')).toBeInTheDocument();
  });

  it('calls onSave when click on CheckIcon', async () => {
    const user = userEvent.setup();
    renderComponent({ selectedEquipment });

    await user.click(screen.getByTestId('EditOutlinedIcon'));
    await user.click(screen.getByTestId('CheckIcon'));
    expect(onSave).toHaveBeenCalledWith(selectedEquipment.id);
  });

  it('hides  when isEditable is false', async () => {
    renderComponent({ selectedEquipment, isEditable: false });
    expect(screen.queryByTestId('EditOutlinedIcon')).not.toBeInTheDocument();
  });
});
