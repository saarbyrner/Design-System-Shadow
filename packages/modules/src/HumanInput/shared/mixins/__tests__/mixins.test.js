import {
  isOpenMixin,
  isClosedMixin,
  drawerPositionMixin,
  drawerToggleMixin,
  drawerMixin,
} from '../index';

const MOCK_THEME = {
  transitions: {
    easing: {
      sharp: '',
    },
    duration: {
      enteringScreen: 1,
    },
    create: (val) => val,
  },
  spacing: (val) => val * 4,
  breakpoints: {
    up: (val) => val,
  },
};

describe('FormLayout mixins', () => {
  describe('isOpenMixin()', () => {
    it('returns the correct value', () => {
      expect(isOpenMixin({ theme: MOCK_THEME })).toStrictEqual({
        overflowX: 'hidden',
        transition: 'width',
        width: 350,
      });
    });
  });

  describe('isClosedMixin()', () => {
    it('returns the correct value', () => {
      expect(isClosedMixin({ theme: MOCK_THEME })).toStrictEqual({
        overflowX: 'hidden',
        transition: 'width',
        width: 'calc(24 + 2px)',
      });
    });
  });

  describe('drawerPositionMixin()', () => {
    it('returns the correct value', () => {
      expect(drawerPositionMixin({ theme: MOCK_THEME })).toStrictEqual({
        position: 'absolute',
        left: '0px',
        lg: {
          left: `60px`,
        },
      });
    });
  });

  describe('drawerToggleMixin()', () => {
    it('returns the correct value when isOpen is false', () => {
      expect(drawerToggleMixin({ isOpen: false })).toStrictEqual({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      });
    });
    it('returns the correct value when isOpen is true', () => {
      expect(drawerToggleMixin({ isOpen: true })).toStrictEqual({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: 2,
      });
    });
  });

  describe('drawerMixin()', () => {
    it('returns the correct value when isOpen is false', () => {
      expect(drawerMixin({ isOpen: false, theme: MOCK_THEME })).toStrictEqual({
        '& .MuiDrawer-paper': {
          overflowX: 'hidden',

          transition: 'width',
          width: 'calc(24 + 2px)',
        },
        '& .MuiDrawer-root': {
          left: '0px',
          lg: {
            left: '60px',
          },
          position: 'absolute',
        },
        '& .MuiPaper-root': {
          left: '0px',
          lg: {
            left: '60px',
          },
          position: 'absolute',
        },
        boxSizing: 'border-box',
        flexShrink: 0,
        height: '100%',
        overflowX: 'hidden',
        p: 2,

        transition: 'width',
        whiteSpace: 'nowrap',
        width: 'calc(24 + 2px)',
      });
    });

    it('returns the correct value when isOpen is true', () => {
      expect(drawerMixin({ isOpen: true, theme: MOCK_THEME })).toStrictEqual({
        '& .MuiDrawer-paper': {
          overflowX: 'hidden',
          transition: 'width',
          width: 350,
        },
        '& .MuiDrawer-root': {
          left: '0px',
          lg: {
            left: '60px',
          },
          position: 'absolute',
        },
        '& .MuiPaper-root': {
          left: '0px',
          lg: {
            left: '60px',
          },
          position: 'absolute',
        },
        boxSizing: 'border-box',
        display: 'flex',
        flexShrink: 0,
        height: '100%',
        overflowX: 'hidden',
        p: 2,
        transition: 'width',
        whiteSpace: 'nowrap',
        width: 350,
      });
    });
  });
});
