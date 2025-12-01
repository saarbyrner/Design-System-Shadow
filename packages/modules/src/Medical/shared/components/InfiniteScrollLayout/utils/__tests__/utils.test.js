import { getScrollThreshold } from '..';

describe('getScrollThreshold', () => {
  describe('when page number is null', () => {
    it('returns default threshold value', () => {
      expect(getScrollThreshold(null)).toEqual(0.8);
    });
  });

  describe('when page number is 2', () => {
    it('returns 0', () => {
      expect(getScrollThreshold(2)).toEqual(0);
    });
  });
  describe('when page number is 3', () => {
    it('returns 0.2', () => {
      expect(getScrollThreshold(3)).toEqual(0.2);
    });
  });
  describe('when page number is 4', () => {
    it('returns 0.3', () => {
      expect(getScrollThreshold(4)).toEqual(0.3);
    });
  });
  describe('when page number is 5', () => {
    it('returns 0.4', () => {
      expect(getScrollThreshold(5)).toEqual(0.4);
    });
  });
  describe('when page number is 6', () => {
    it('returns 0.5', () => {
      expect(getScrollThreshold(6)).toEqual(0.5);
    });
  });
  describe('when page number is 7', () => {
    it('returns 0.6', () => {
      expect(getScrollThreshold(7)).toEqual(0.6);
    });
  });
  describe('when page number is 8', () => {
    it('returns 0.7', () => {
      expect(getScrollThreshold(8)).toEqual(0.7);
    });
  });
  describe('when page number is 9 or greater', () => {
    it('returns 0.8', () => {
      expect(getScrollThreshold(9)).toEqual(0.8);
      expect(getScrollThreshold(10)).toEqual(0.8);
    });
  });
});
