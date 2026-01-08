import {
  checkRenderRightSideVisibility,
  getXBoundary,
  searchLabel,
  searchList,
  defaultMapToOptions,
} from '../utils';

describe('Select Utils', () => {
  describe('checkRenderRightSideVisibility', () => {
    it('returns true if there is enough space to render on the Right', () => {
      expect(
        checkRenderRightSideVisibility(
          {
            current: {
              getBoundingClientRect: () => ({
                right: 400,
              }),
            },
          },
          1000
        )
      ).toBeTruthy();
    });
    it('returns false if there is not enough space to render on the Right', () => {
      expect(
        checkRenderRightSideVisibility(
          {
            current: {
              getBoundingClientRect: () => ({
                right: 1200,
              }),
            },
          },
          1000
        )
      ).toBeFalsy();
    });
    it('returns true if if it is mobile view', () => {
      expect(
        checkRenderRightSideVisibility(
          {
            current: {
              getBoundingClientRect: () => ({
                right: 1200,
              }),
            },
          },
          700
        )
      ).toBeTruthy();
    });
  });

  describe('getXBoundary', () => {
    it('returns the x boundary with the offset width if there is another space to render on the right', () => {
      const refObj = {
        current: {
          getBoundingClientRect: () => ({
            right: 400,
            x: 400,
          }),
          offsetWidth: 400,
        },
      };
      expect(getXBoundary(refObj, 1000)).toEqual(800);
    });
    it('returns the x boundary with a negative offset to position it to the left', () => {
      const refObj = {
        current: {
          getBoundingClientRect: () => ({
            right: 1200,
            x: 1200,
          }),
        },
      };
      expect(getXBoundary(refObj, 1000)).toEqual(1100);
    });
  });

  describe('searchLabel', () => {
    it('returns true if the search string is in the label', () => {
      expect(searchLabel('test 1', 'test')).toEqual(true);
    });

    it('returns true if search string is empty', () => {
      expect(searchLabel('option', '')).toEqual(true);
    });

    it('returns false if the search string is not the label', () => {
      expect(searchLabel('example', 'other word')).toEqual(false);
    });
  });

  describe('searchList', () => {
    const optionList = [
      { label: 'test 1' },
      { label: 'test 2' },
      { label: 'other option' },
    ];
    it('returns matching labels from an array', () => {
      expect(searchList(optionList, 'test')).toEqual(optionList.splice(0, 2));
    });

    it('returns all matching labels if search string is empty', () => {
      expect(searchList(optionList, '')).toEqual(optionList);
    });

    it('returns no options if the search string is not the label', () => {
      expect(searchList(optionList, 'text')).toEqual([]);
    });
  });

  describe('defaultMapToOptions', () => {
    it('maps data correctly', () => {
      const option = { name: 'name', id: 1, extraField: true };
      expect(defaultMapToOptions([option])).toEqual([
        { ...option, label: option.name, value: option.id },
      ]);
    });
  });
});
