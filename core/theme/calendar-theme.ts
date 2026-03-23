import { PRIMARY } from './colors';

export const calendarTheme = {
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: PRIMARY,
    },
  },
  itemDay: {
    active: () => ({
      container: {
        backgroundColor: PRIMARY,
      },
      content: {
        color: 'white',
      },
    }),
  },
};
