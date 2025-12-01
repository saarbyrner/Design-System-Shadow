// @flow
import { useState } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { AthleteSelectTranslated as AthleteSelect } from './AthleteSelect';
import { AthleteProvider, AthletesBySquadSelector } from './components';
import squadAthletesResponse from './__mocks__/squadAthletes';
import SlidingPanel from '../SlidingPanel';
import TextButton from '../TextButton';
import type { SquadAthletesSelection } from './types';

const squadAthletes = squadAthletesResponse.squads;

export const Basic = (inputArgs: Object) => {
  const [value, setValue] = useState<Array<SquadAthletesSelection>>([]);
  const squadAthletesList = inputArgs['Single squad']
    ? [squadAthletes[0]]
    : squadAthletes;

  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <div
        css={css`
          flex: 1;
          max-width: 50%;
        `}
      >
        <AthleteSelect
          label={inputArgs.label}
          placeholder={inputArgs.placeholder}
          isLoading={inputArgs.isLoading}
          squadAthletes={squadAthletesList}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          isMulti={inputArgs.isMulti}
          includeContextSquad={inputArgs.includeContextSquad}
          defaultSelectedSquadId={inputArgs.defaultSelectedSquadId}
        />
      </div>

      {inputArgs['Show value'] && (
        <pre
          css={css`
            margin: 20px 10px;
            background-color: ${colors.neutral_200};
            color: ${colors.grey_400};
            padding: 10px;
            border-radius: 8px;
            flex: 1;
            max-height: 80vh;
            overflow: auto;
          `}
        >
          {value ? JSON.stringify(value, null, 2) : ''}
        </pre>
      )}
    </div>
  );
};

Basic.args = {
  label: 'Athletes',
  placeholder: 'Select athletes...',
  isLoading: false,
  isMulti: false,
  includeContextSquad: false,
  defaultSelectedSquadId: null,
  'Single squad': false,
  'Show value': false,
};

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [value, setValue] = useState([]);
  const [selectedSquadId, setSelectedSquadId] = useState(8);

  return (
    <>
      <TextButton
        text="Toggle"
        onClick={() => setIsOpen(!isOpen)}
        kitmanDesignSystem
      />
      <SlidingPanel
        isOpen={isOpen}
        togglePanel={() => setIsOpen(false)}
        cssTop={0}
      >
        <div style={{ height: 'calc(100% - 20px)' }}>
          <AthleteProvider
            squadAthletes={squadAthletes}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            isMulti
          >
            <AthletesBySquadSelector
              searchValue=""
              selectedSquadId={selectedSquadId}
              onSquadClick={setSelectedSquadId}
            />
          </AthleteProvider>
        </div>
      </SlidingPanel>
    </>
  );
};

export default {
  title: 'Form Components/Athletes',
  component: AthleteSelect,
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    placeholder: {
      control: { type: 'text' },
    },
    isLoading: {
      control: { type: 'boolean' },
    },
    isMulti: {
      control: { type: 'boolean' },
    },
    includeContextSquad: {
      control: { type: 'boolean' },
    },
    defaultSelectedSquadId: {
      options: [null, ...squadAthletes.map(({ id }) => id)],
      control: {
        type: 'select',
        labels: squadAthletes.reduce((acc, curr) => {
          return { ...acc, [`${curr.id}`]: curr.name };
        }, {}),
      },
    },
    'Single squad': {
      control: { type: 'boolean' },
    },
    'Show value': {
      control: { type: 'boolean' },
    },
  },
};
