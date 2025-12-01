import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPanel from '..';
import { render } from '../../../testUtils';
import * as utilFuncs from '../../../utils';

const props = {
  t: i18nextTranslateStub(),
  isOpen: true,
  onClose: jest.fn(),
  onApply: jest.fn(),
  onClear: jest.fn(),
};

describe('TemplateDashboards|FilterPanel', () => {
  it('renders panel with title', () => {
    render(<FilterPanel {...props} />);

    expect(screen.queryByText('Filter')).toBeVisible();
  });

  it('should not render panel if isOpen is false', () => {
    const updatedProps = {
      ...props,
      isOpen: false,
    };
    render(<FilterPanel {...updatedProps} />);
    expect(screen.queryByText('Filter')).not.toBeVisible();
  });

  it('onClose to be called', async () => {
    const component = render(<FilterPanel {...props} />);
    const user = userEvent.setup();

    await user.click(
      component.container.getElementsByClassName('icon-close')[0]
    );

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('onApply to be called', async () => {
    const component = render(<FilterPanel {...props} />);
    const user = userEvent.setup();

    await user.click(
      component.container.getElementsByClassName(
        'textButton--kitmanDesignSystem--primary'
      )[0]
    );

    expect(props.onApply).toHaveBeenCalledTimes(1);
  });

  it('onClear to be called', async () => {
    const component = render(<FilterPanel {...props} />);
    const user = userEvent.setup();

    await user.click(
      component.container.getElementsByClassName(
        'textButton--kitmanDesignSystem--textOnly'
      )[0]
    );

    expect(props.onClear).toHaveBeenCalledTimes(1);
  });

  describe('for Growth & Maturation Report', () => {
    beforeEach(() => {
      jest
        .spyOn(utilFuncs, 'isGrowthAndMaturationReport')
        .mockReturnValue(() => true);
    });
    it('should not render the TimeScopeFilter', () => {
      const { queryByText } = render(<FilterPanel {...props} />);

      expect(queryByText('Date')).not.toBeInTheDocument();
    });
  });
});
