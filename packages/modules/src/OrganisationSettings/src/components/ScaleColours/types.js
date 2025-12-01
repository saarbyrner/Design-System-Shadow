// @flow

export type ScaleColours = {
  id: number,
  name: string,
  conditions: Array<{
    id: number,
    condition: 'equals',
    value1: number,
    colour: string,
  }>,
  metrics: Array<{
    id: number,
    record_type: 'TrainingVariable',
    record: {
      id: number,
      name: string,
    },
  }>,
};
