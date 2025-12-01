import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import TypeSelector from '../TypeSelector';

describe('<TypeSelector />', () => {
  const setSelectedTypeMock = jest.fn();
  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    t: i18nT,
    selectedType: 'MedicalInjury',
    setSelectedType: setSelectedTypeMock,
  };

  it('renders Injuries and Illnesses buttons', () => {
    render(<TypeSelector {...props} />);
    expect(screen.getByText('Source')).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Injuries',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Illnesses',
      })
    ).toBeInTheDocument();
  });

  it('will hide medical illness button when `hideIllness` is true', () => {
    render(<TypeSelector {...props} hideIllness />);

    expect(
      screen.getByRole('button', {
        name: 'Injuries',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Illnesses',
      })
    ).not.toBeInTheDocument();
  });

  it('calls setSelectedType with new type', async () => {
    const user = userEvent.setup();

    render(<TypeSelector {...props} />);

    const illnessButton = screen.getByRole('button', {
      name: 'Illnesses',
    });
    await user.click(illnessButton);
    expect(setSelectedTypeMock).toHaveBeenCalledWith('MedicalIllness');
  });

  describe('[feature-flag] rep-medical-rehabs-source ON', () => {
    beforeEach(() => {
      window.featureFlags['rep-medical-rehabs-source'] = true;
    });

    afterEach(() => {
      window.featureFlags['rep-medical-rehabs-source'] = false;
    });

    it('does not render segment control buttons', async () => {
      render(<TypeSelector {...props} />);
      expect(
        screen.queryByRole('button', {
          name: 'Injuries',
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: 'Illnesses',
        })
      ).not.toBeInTheDocument();
    });

    it('renders a select wrapper component', async () => {
      const user = userEvent.setup();
      render(<TypeSelector {...props} />);

      // Initial selection:
      expect(screen.getByText('Injuries')).toBeInTheDocument();

      const selectComponent = screen.getByLabelText('Source');
      await user.click(selectComponent);

      expect(
        screen.getByRole('option', {
          name: 'Injuries',
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', {
          name: 'Illnesses',
        })
      ).toBeInTheDocument();

      const rehabsOption = screen.getByRole('option', {
        name: 'Rehab exercises',
      });
      await user.click(rehabsOption);

      expect(setSelectedTypeMock).toHaveBeenCalledWith('RehabSessionExercise');
    });

    it('will hide medical illness button when `hideIllness` is true', async () => {
      const user = userEvent.setup();
      render(
        <TypeSelector
          {...props}
          selectedType="RehabSessionExercise"
          hideIllness
        />
      );

      // Initial selection:
      expect(screen.getByText('Rehab exercises')).toBeInTheDocument();

      const selectComponent = screen.getByLabelText('Source');
      await user.click(selectComponent);

      expect(
        screen.getByRole('option', {
          name: 'Injuries',
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', {
          name: 'Rehab exercises',
        })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('option', {
          name: 'Illnesses',
        })
      ).not.toBeInTheDocument();
    });
  });
});
