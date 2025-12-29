export interface CoachConfig {
  class: 'First' | 'Economy' | 'Business';
  count: number; // Number of coaches of this class
  seatsPerCoach: number;
}

export interface TrainConfig {
  trainNumber: string;
  coaches: CoachConfig[];
}

export const trainsData: TrainConfig[] = [
  {
    trainNumber: 'EXP-001',
    coaches: [
      { class: 'First', count: 2, seatsPerCoach: 40 },
      { class: 'Business', count: 4, seatsPerCoach: 48 },
      { class: 'Economy', count: 2, seatsPerCoach: 60 },
    ],
  },
  {
    trainNumber: 'EXP-002',
    coaches: [
      { class: 'First', count: 2, seatsPerCoach: 40 },
      { class: 'Business', count: 4, seatsPerCoach: 48 },
      { class: 'Economy', count: 2, seatsPerCoach: 60 },
    ],
  },
  {
    trainNumber: 'EXP-003',
    coaches: [
      { class: 'First', count: 3, seatsPerCoach: 36 },
      { class: 'Business', count: 3, seatsPerCoach: 48 },
      { class: 'Economy', count: 2, seatsPerCoach: 60 },
    ],
  },

  // Standard Trains (Mixed service)
  {
    trainNumber: 'STD-101',
    coaches: [
      { class: 'First', count: 1, seatsPerCoach: 40 },
      { class: 'Business', count: 3, seatsPerCoach: 48 },
      { class: 'Economy', count: 6, seatsPerCoach: 60 },
    ],
  },
  {
    trainNumber: 'STD-102',
    coaches: [
      { class: 'First', count: 1, seatsPerCoach: 40 },
      { class: 'Business', count: 3, seatsPerCoach: 48 },
      { class: 'Economy', count: 6, seatsPerCoach: 60 },
    ],
  },
  {
    trainNumber: 'STD-103',
    coaches: [
      { class: 'First', count: 1, seatsPerCoach: 40 },
      { class: 'Business', count: 4, seatsPerCoach: 48 },
      { class: 'Economy', count: 5, seatsPerCoach: 60 },
    ],
  },

  // Local Trains (Economy only)
  {
    trainNumber: 'LOC-201',
    coaches: [{ class: 'Economy', count: 6, seatsPerCoach: 60 }],
  },
  {
    trainNumber: 'LOC-202',
    coaches: [{ class: 'Economy', count: 6, seatsPerCoach: 60 }],
  },
  {
    trainNumber: 'LOC-203',
    coaches: [{ class: 'Economy', count: 8, seatsPerCoach: 60 }],
  },
  {
    trainNumber: 'LOC-204',
    coaches: [{ class: 'Economy', count: 8, seatsPerCoach: 60 }],
  },
];
