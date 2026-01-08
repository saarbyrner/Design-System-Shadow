// @flow

import { colors } from '@kitman/common/src/variables';
import { calendarViewOptionEnumLike } from './enum-likes';

const commonEventTextStyles = {
  borderRadius: '3px',
  width: '100%',
};

const eventTextOverflowStyles = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  display: 'flex',
  justifyContent: 'space-between',
};

type GetEventTextStyles = {
  borderColor: string,
  textColor?: string,
  backgroundColor: string,
};

export const getEventTextStyles = ({
  backgroundColor,
  borderColor,
  textColor,
}: GetEventTextStyles) => ({
  [calendarViewOptionEnumLike.dayGridMonth]: {
    backgroundColor,
    border: `1px solid ${borderColor}`,
    color: textColor,
    ...eventTextOverflowStyles,
    ...commonEventTextStyles,
    justifyContent: 'start',
    alignItems: 'center',
  },
  [calendarViewOptionEnumLike.listWeek]: {
    borderColor,
    color: textColor,
    ...eventTextOverflowStyles,
    ...commonEventTextStyles,
  },
  default: {
    borderColor,
    color: textColor,
    ...commonEventTextStyles,
    title: {
      fontWeight: 600,
      fontSize: '12px',
      margin: 0,
    },
    calendarHeader: {
      display: 'flex',
      alignItems: 'center',
    },
    time: {
      fontWeight: 400,
      fontSize: '11px',
      margin: 0,
    },
  },
});
export default {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'white',
  },
  calendarHeaderContainer: { padding: '1rem', background: 'white' },
  filterButtonContainer: {
    paddingLeft: '1rem',
  },
  calendarWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  optimizedCalendarFFCalendar: {
    marginTop: '2.375rem',
  },
  calendar: {
    width: '100%',
    '.fc-daygrid-event': {
      div: {
        color: colors.p06,
        backgroundColor: 'var(--fc-event-bg-color)',
        borderColor: 'var(--fc-event-border-color)',
      },
    },
    '.fc-media-screen': {
      width: '100%',
    },

    '.fc-daygrid-day-number': {
      padding: '1px 4px',
    },

    '.fc-event-main': {
      overflow: 'hidden',
      backgroundColor: 'transparent',
    },

    '.fc-list-event': {
      '&:hover': {
        td: {
          backgroundColor: 'var(--fc-page-bg-color) !important',
        },
        a: {
          textDecoration: 'none !important',
        },
      },

      a: {
        color: colors.s18,
        fontWeight: 600,
        margin: '0px',
      },

      '.fc-list-event-time': {
        fontWeight: 400,
      },

      '.fc-list-event-title': {
        backgroundColor: 'white',
      },
    },

    '.fc-list-day': {
      th: {
        borderBottom: '0px',
      },
      '.fc-list-day-cushion': {
        backgroundColor: 'var(--fc-page-bg-color)',
      },
      a: {
        fontWeight: 400,
      },
    },
    '.fc-col-header-cell': {
      a: {
        color: colors.s18,
        fontWeight: 500,
        padding: '10px 4px',
      },
    },
    '.fc': {
      background: colors.p06,
      padding: '15px 20px',
      '.fc-scrollgrid': {
        borderTop: '0px',
        borderLeft: '0px',
        '.fc-scrollgrid-sync-table': {
          borderLeft: '1px solid var(--fc-border-color)',
        },
        th: {
          borderRightWidth: '0px',
        },
      },
      '.fc-col-header-cell': {
        borderRight: '0px',
        borderLeft: '0px',
      },
      '.fc-list-empty': {
        background: colors.p06,
      },
      '.fc-toolbar': {
        '&.fc-header-toolbar': {
          margin: '15px 0',
        },
      },
      '.fc-prev-button, .fc-next-button': {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: colors.p01,
        fontSize: '14px',
        fontWeight: 600,
        height: '36px',
        margin: '0',
        padding: '0',
        width: '45px',
        '&:active': {
          background: colors.s21,
          borderColor: colors.s21,
          color: colors.p06,
        },
        '.fc-icon': {
          fontFamily: "'kitman' !important",
        },
        '&.fc-prev-button': {
          '.fc-icon': {
            '&:before': {
              content: "'\\e913'",
            },
          },
        },
        '&.fc-next-button': {
          '.fc-icon': {
            '&:before': {
              content: "'\\e904'",
            },
          },
        },
      },
      [`
      .fc-dayGridMonth-button,
      .fc-timeGridWeek-button,
      .fc-timeGridDay-button,
      .fc-listWeek-button,
      .fc-today-button
      `]: {
        background: colors.p01,
        borderColor: colors.p01,
        borderRadius: '0.25em !important',
        color: colors.p06,
        height: '36px',
        margin: '0 10.5px',
        padding: '0 15px',
        [`
        &:hover,
        &:focus
        `]: {
          background: colors.p02,
          borderColor: colors.p02,
          color: colors.p06,
          cursor: 'pointer',
        },
        '&.fc-button-active': {
          background: colors.s21,
          borderColor: colors.s21,
          color: colors.p06,
        },
        [`
        &.fc-button-active,
        &:active,
        &:active
        `]: {
          '&:focus': {
            background: colors.s21,
            borderColor: `${colors.s21} !important`,
            color: colors.p06,
          },
        },
        [`
        &.disabled,
        &[disabled]
        `]: {
          background: colors.p05,
          borderColor: colors.p05,
          color: colors.s17,
          cursor: 'default',
          opacity: 1,
        },
      },
      '.fc-timegrid-slot': {
        height: '2.4em',
        borderBottom: '0 !important',
      },
      '.fc-time-grid': {
        '.fc-slats': {
          td: {
            height: '2.4em',
          },
        },
      },
      '.fc-event': {
        fontWeight: 600,
        lineHeight: 1.3,
      },
      '.fc-day-header': {
        borderWidth: '0',
      },
      '.fc-head-container': {
        borderWidth: '0',
      },
      '.fc-axis': {
        '&.fc-widget-header': {
          borderWidth: '0',
        },
      },
      '.fc-listWeek-view': {
        td: {
          border: '0',
        },
        '.fc-list-heading': {
          borderTop: `1px solid ${colors.neutral_300}`,
          '&:first-of-type': {
            borderTop: '0',
          },
          '.fc-widget-header': {
            background: 'none',
            borderColor: 'transparent',
            padding: '15px',
          },
          '.fc-list-heading-main': {
            display: 'inline-block',
            fontWeight: 'normal',
            paddingRight: '5px',
            textTransform: 'uppercase',
            '&:after': {
              content: "','",
            },
          },
          '.fc-list-heading-alt': {
            display: 'inline-block',
            cssFloat: 'left',
            fontWeight: 'normal',
            textTransform: 'uppercase',
          },
        },
        '.fc-list-item': {
          display: 'block',
          padding: '10px 15px 10px 30px',
          position: 'relative',
          '&:hover': {
            td: {
              background: 'none',
            },
          },
          '.fc-list-item-time': {
            display: 'inline-block',
            overflow: 'hidden',
            padding: '0 15px',
            width: 'auto',
          },
          '.fc-list-item-marker': {
            display: 'inline-block',
            left: '15px',
            overflow: 'hidden',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'auto',
          },
          '.fc-list-item-title': {
            display: 'inline-block',
            overflow: 'hidden',
            width: 'auto',
            a: {
              color: colors.s18,
              fontWeight: 600,
              '&:hover': {
                color: colors.s18,
                textDecoration: 'none',
              },
            },
          },
        },
      },
    },
    '.calendar__columnHeaderDay': {
      display: 'block',
      fontSize: '12px',
      fontWeight: 'normal',
      marginBottom: '5px',
      color: colors.s18,
    },
    '.calendar__columnHeaderDate': {
      display: 'block',
      fontSize: '20px',
      fontWeight: 'normal',
      marginBottom: '15px',
      color: colors.s18,
    },
  },
};
