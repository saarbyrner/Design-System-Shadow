// @flow

export const getScrollThreshold = (pageNumber: number | null): number => {
  switch (pageNumber) {
    case 2: {
      return 0;
    }
    case 3: {
      return 0.2;
    }
    case 4: {
      return 0.3;
    }
    case 5: {
      return 0.4;
    }
    case 6: {
      return 0.5;
    }
    case 7: {
      return 0.6;
    }
    case 8: {
      return 0.7;
    }

    default: {
      return 0.8;
    }
  }
};
