import { renderHook } from '@testing-library/react-hooks';
import useRelativeFontSize from '../useRelativeFontSize';

describe('analysis hooks | useRelativeFontSize', () => {
  describe('when the font size is larger than the container', () => {
    it('scales the font size down when the height is greater than the continer', async () => {
      const { result, rerender } = renderHook(() => useRelativeFontSize(400));

      const [, containerRef, childRef] = result.current;

      // setting up size of elements so that they are
      containerRef.current = {
        clientHeight: 322,
        clientWidth: 520,
      };
      childRef.current = {
        scrollHeight: 500,
        scrollWidth: 500,
      };

      rerender();
      // first we expect the fontsize to match the height of the container
      expect(result.current[0]).toBe(322);

      // if the font size is 322 but the scroll height is still bigger
      childRef.current = {
        scrollHeight: 323,
        scrollWidth: 500,
      };

      rerender();

      // then we expect it to be scaled down to fit neatly in the parent
      expect(result.current[0]).toBe(322 * 0.95);
    });

    it('scales the font size down if the width is greater than its container', () => {
      const START_SIZE = 400;
      const { result, rerender } = renderHook(() =>
        useRelativeFontSize(START_SIZE)
      );

      const [, containerRef, childRef] = result.current;

      // setting up size of elements so that they are
      containerRef.current = {
        clientHeight: 322,
        clientWidth: 350,
      };
      childRef.current = {
        scrollHeight: 320,
        scrollWidth: 360,
      };

      rerender();

      // first we expect the fontsize to match the height of the container
      expect(result.current[0]).toBe(START_SIZE * 0.95);

      childRef.current = {
        scrollHeight: 320,
        // assuming that this update to fontsize reduces the width to 355
        scrollWidth: 355,
      };

      rerender();
      // expecting one more scale down of the font size
      expect(result.current[0]).toBe(380 * 0.95);

      childRef.current = {
        scrollHeight: 320,
        // assuming that this update to fontsize reduces the width to 345
        scrollWidth: 345,
      };

      rerender();
      // expecting the font size to remain the same now because the width is smaller than the parent width
      expect(result.current[0]).toBe(380 * 0.95);
    });
  });

  describe('when the font size is smaller', () => {
    it('scales the font size up when it is a smaller element', () => {
      const { result, rerender } = renderHook(() => useRelativeFontSize(400));

      const [, containerRef, childRef] = result.current;

      // setting up size of elements so that they are small
      containerRef.current = {
        clientHeight: 50,
        clientWidth: 50,
      };
      childRef.current = {
        scrollHeight: 60,
        scrollWidth: 60,
      };

      rerender();
      expect(result.current[0]).toBe(50);

      // making the container large to simulate maybe a screen resize
      containerRef.current = {
        clientHeight: 100,
        clientWidth: 100,
      };
      childRef.current = {
        scrollHeight: 50,
        scrollWidth: 50,
      };

      rerender();

      // will scale up this font size
      expect(result.current[0]).toBe(50 * 1.05);
    });

    it('will not scale the font size up greater than the max font size provided', () => {
      const MAX_FONT_SIZE = 51;
      const { result, rerender } = renderHook(() =>
        useRelativeFontSize(MAX_FONT_SIZE)
      );

      const [, containerRef, childRef] = result.current;

      // setting up size of elements so that they are small
      containerRef.current = {
        clientHeight: 50,
        clientWidth: 50,
      };
      childRef.current = {
        scrollHeight: 60,
        scrollWidth: 60,
      };

      rerender();
      expect(result.current[0]).toBe(50);

      // making the container large to simulate maybe a screen resize
      containerRef.current = {
        clientHeight: 500,
        clientWidth: 500,
      };
      childRef.current = {
        scrollHeight: 50,
        scrollWidth: 50,
      };

      rerender();

      // will scale up to the max font size
      expect(result.current[0]).toBe(MAX_FONT_SIZE);
    });
  });
});
