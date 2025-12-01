import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DecoratorSelector from '..';

describe('Graph Composer <DecoratorSelector /> component', () => {
  const i18nT = i18nextTranslateStub();
  const onChangeAction = jest.fn();

  const baseProps = {
    decorators: {
      injuries: false,
      illnesses: false,
    },
    visible: {
      injuries: true,
      illnesses: true,
    },
    onChange: onChangeAction,
    t: i18nT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const { container } = render(<DecoratorSelector {...baseProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders 2 checkboxes', () => {
    render(<DecoratorSelector {...baseProps} />);

    const injuriesCheckbox = screen.getByLabelText('Injuries');
    expect(injuriesCheckbox).toBeInTheDocument();
    expect(injuriesCheckbox).not.toBeChecked();

    const illnessesCheckbox = screen.getByLabelText('Illnesses');
    expect(illnessesCheckbox).toBeInTheDocument();
    expect(illnessesCheckbox).not.toBeChecked();
  });

  describe('When the decorators are selected', () => {
    const customProps = {
      decorators: {
        injuries: true,
        illnesses: true,
        data_labels: true,
      },
      visible: {
        injuries: true,
        illnesses: true,
        data_labels: true,
      },
      onChange: onChangeAction,
      t: i18nT,
    };

    it('checks the checkboxes', () => {
      render(<DecoratorSelector {...customProps} />);

      expect(screen.getByLabelText('Injuries')).toBeChecked();
      expect(screen.getByLabelText('Illnesses')).toBeChecked();
      expect(screen.getByLabelText('Data Labels')).toBeChecked();
    });
  });

  describe('When the user click a checkbox', () => {
    it('calls the action onChange with the correct parameters', async () => {
      const user = userEvent.setup();
      render(<DecoratorSelector {...baseProps} />);

      const injuriesCheckbox = screen.getByLabelText('Injuries');
      await user.click(injuriesCheckbox);

      const expectedDecorators = {
        injuries: true,
        illnesses: false,
      };
      expect(onChangeAction).toHaveBeenCalledWith(expectedDecorators);
    });
  });

  describe('when there are no injuries', () => {
    const propsWithoutInjuries = {
      ...baseProps,
      visible: {
        injuries: false,
        illnesses: true,
      },
    };

    it('doesnt show the injuries decorator checkbox', () => {
      render(<DecoratorSelector {...propsWithoutInjuries} />);
      expect(screen.queryByLabelText('Injuries')).not.toBeInTheDocument();
    });
  });

  describe('when there are no illnesses', () => {
    const propsWithoutIllnesses = {
      ...baseProps,
      visible: {
        injuries: true,
        illnesses: false,
      },
    };

    it('doesnt show the illnesses decorator checkbox', () => {
      render(<DecoratorSelector {...propsWithoutIllnesses} />);
      expect(screen.queryByLabelText('Illnesses')).not.toBeInTheDocument();
    });
  });

  describe('when there are no illnesses and injuries', () => {
    const propsWithoutBoth = {
      ...baseProps,
      visible: {
        injuries: false,
        illnesses: false,
      },
    };

    it('hides the decorators completely', () => {
      const { container } = render(<DecoratorSelector {...propsWithoutBoth} />);
      expect(
        container.querySelector('.graphComposerDecoratorSelector__checkbox')
      ).not.toBeInTheDocument();
    });
  });

  describe('when the data_labels checkbox visibility is set to false', () => {
    const propsWithoutDataLabels = {
      ...baseProps,
      visible: {
        injuries: true,
        illnesses: true,
        data_labels: false,
      },
    };

    it('doesnt show the data_labels decorator checkbox', () => {
      render(<DecoratorSelector {...propsWithoutDataLabels} />);
      expect(screen.queryByLabelText('Data Labels')).not.toBeInTheDocument();
    });
  });
});
