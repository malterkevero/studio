export const QueenColors = ['fehér', 'sárga', 'piros', 'zöld', 'kék'] as const;
export type QueenColor = typeof QueenColors[number];

export type Hive = {
  id: string;
  name: string;
  queen: {
    year: number;
    color: QueenColor;
    type: string | undefined;
  };
  strength: number;
  health: {
    miteLevel: string | undefined;
    diseases: string | undefined;
  };
  food: {
    honey: number | undefined;
    pollen: number | undefined;
  };
  lastIntervention: {
    date: Date;
    type: string | undefined;
  };
  notes: string | undefined;
};
