import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScrollControls, { addDelta } from '../components/ScrollControls';

describe('analysis XYChart|<ScrollControls />', () => {
  describe('addDelta', () => {
    it('adds a delta number to the current position and returns new position', () => {
      expect(addDelta(20, 10, 50, 5)).toBe(30);
      expect(addDelta(20, 10, 50, 5)).toBe(30);
    });

    it('will not return a new position if it is higher than max width', () => {
      expect(addDelta(40, 10, 50, 5)).toBe(45);
    });

    it('will not return a new position if it is lower than min', () => {
      expect(addDelta(10, -15, 50, 5)).toBe(0);
    });
  });

  describe('ScrollControl', () => {
    it('clicking the button will call setScroll with new indexes and toggle of active', async () => {
      const setScroll = jest.fn();
      render(
        <ScrollControls
          maxLabelWidth={70}
          numItems={10}
          scroll={{ isActive: false, startIndex: 5, endIndex: 10 }}
          setScroll={setScroll}
          width={700}
        />
      );
      const zoomButtonContainer = screen.getByTestId(
        'XYChart|ScrollControls|Zoom'
      );

      await userEvent.click(within(zoomButtonContainer).getByRole('button'));

      expect(setScroll).toHaveBeenLastCalledWith({
        startIndex: 0,
        endIndex: 10,
        isActive: true,
      });
    });
  });
});
