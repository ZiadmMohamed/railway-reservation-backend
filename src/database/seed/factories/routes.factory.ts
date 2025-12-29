export interface RouteConfig {
  name: string;
  stations: string[]; // Station names in order
  avgMinutesBetweenStops: number; // Average minutes between each stop
}

export const routesData: RouteConfig[] = [
  {
    name: 'Cairo to Aswan',
    stations: [
      'Cairo Ramses',
      'Giza',
      'Beni Suef',
      'Minya',
      'Asyut',
      'Sohag',
      'Qena',
      'Luxor',
      'Aswan',
    ],
    avgMinutesBetweenStops: 60,
  },
  {
    name: 'Cairo to Alexandria',
    stations: ['Cairo Ramses', 'Giza', 'Tanta', 'Damanhur', 'Alexandria'],
    avgMinutesBetweenStops: 40,
  },
  {
    name: 'Cairo to Luxor',
    stations: ['Cairo Ramses', 'Giza', 'Beni Suef', 'Minya', 'Asyut', 'Sohag', 'Qena', 'Luxor'],
    avgMinutesBetweenStops: 60,
  },
  {
    name: 'Alexandria to Port Said',
    stations: ['Alexandria', 'Damanhur', 'Tanta', 'Zagazig', 'Ismailia', 'Port Said'],
    avgMinutesBetweenStops: 50,
  },
  {
    name: 'Cairo to Port Said',
    stations: ['Cairo Ramses', 'Zagazig', 'Ismailia', 'Port Said'],
    avgMinutesBetweenStops: 45,
  },
  {
    name: 'Cairo to Suez',
    stations: ['Cairo Ramses', 'Ismailia', 'Suez'],
    avgMinutesBetweenStops: 50,
  },
  {
    name: 'Cairo to Mansoura',
    stations: ['Cairo Ramses', 'Zagazig', 'Mansoura'],
    avgMinutesBetweenStops: 45,
  },
  {
    name: 'Tanta to Kafr El Sheikh',
    stations: ['Tanta', 'Kafr El Sheikh'],
    avgMinutesBetweenStops: 40,
  },
  {
    name: 'Cairo to Fayoum',
    stations: ['Cairo Ramses', 'Giza', 'Beni Suef', 'Fayoum'],
    avgMinutesBetweenStops: 35,
  },
];
