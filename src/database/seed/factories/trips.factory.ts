export interface TripTemplate {
  routeName: string;
  trainNumber: string;
  departureHour: number;
  departureMinute: number;
  daysFromNow: number[];
}

export const tripsTemplates: TripTemplate[] = [
  {
    routeName: 'Cairo to Aswan',
    trainNumber: 'EXP-001',
    departureHour: 8,
    departureMinute: 0,
    daysFromNow: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27],
  },
  {
    routeName: 'Cairo to Aswan',
    trainNumber: 'STD-101',
    departureHour: 14,
    departureMinute: 30,
    daysFromNow: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28],
  },
  {
    routeName: 'Cairo to Aswan',
    trainNumber: 'STD-102',
    departureHour: 20,
    departureMinute: 0,
    daysFromNow: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29],
  },

  {
    routeName: 'Cairo to Alexandria',
    trainNumber: 'EXP-002',
    departureHour: 7,
    departureMinute: 0,
    daysFromNow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    routeName: 'Cairo to Alexandria',
    trainNumber: 'STD-103',
    departureHour: 11,
    departureMinute: 30,
    daysFromNow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    routeName: 'Cairo to Alexandria',
    trainNumber: 'LOC-201',
    departureHour: 16,
    departureMinute: 0,
    daysFromNow: [0, 1, 2, 3, 4, 5, 6, 7],
  },

  {
    routeName: 'Cairo to Luxor',
    trainNumber: 'EXP-003',
    departureHour: 9,
    departureMinute: 0,
    daysFromNow: [0, 2, 4, 6, 8, 10, 12, 14],
  },
  {
    routeName: 'Cairo to Luxor',
    trainNumber: 'STD-101',
    departureHour: 18,
    departureMinute: 30,
    daysFromNow: [1, 3, 5, 7, 9, 11, 13, 15],
  },

  {
    routeName: 'Alexandria to Port Said',
    trainNumber: 'LOC-202',
    departureHour: 10,
    departureMinute: 0,
    daysFromNow: [0, 2, 4, 6, 8, 10],
  },

  {
    routeName: 'Cairo to Port Said',
    trainNumber: 'LOC-203',
    departureHour: 12,
    departureMinute: 0,
    daysFromNow: [0, 1, 2, 3, 4, 5],
  },

  {
    routeName: 'Cairo to Suez',
    trainNumber: 'LOC-204',
    departureHour: 13,
    departureMinute: 30,
    daysFromNow: [0, 1, 2, 3, 4],
  },

  {
    routeName: 'Cairo to Mansoura',
    trainNumber: 'LOC-201',
    departureHour: 8,
    departureMinute: 30,
    daysFromNow: [1, 3, 5, 7],
  },

  {
    routeName: 'Tanta to Kafr El Sheikh',
    trainNumber: 'LOC-202',
    departureHour: 15,
    departureMinute: 0,
    daysFromNow: [0, 2, 4],
  },

  {
    routeName: 'Cairo to Fayoum',
    trainNumber: 'LOC-203',
    departureHour: 17,
    departureMinute: 0,
    daysFromNow: [0, 1, 2],
  },
];
