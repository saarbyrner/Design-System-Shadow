import $ from 'jquery';
import moment from 'moment-timezone';
import { renderHook, act } from '@testing-library/react-hooks';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import sinon from 'sinon';
import useAthletesIssues from '../useAthletesIssues';

describe('useAthletesIssues', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');

    sinon
      .stub($, 'ajax')
      .withArgs(
        sinon.match({
          url: '/ui/medical/athletes/1/issue_occurrences',
          data: {
            grouped: true,
          },
        })
      )
      .returns($.Deferred().resolveWith(null, [data.groupedIssues]));
  });

  afterEach(() => {
    moment.tz.setDefault();
    $.ajax.restore();
  });

  it('returns the expected data when mounting the hook', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAthletesIssues(1)
    );

    await waitForNextUpdate();

    const [openIssues, closedIssues] = result.current.athleteIssues;
    expect(openIssues.label).toEqual('Open injury/ illness');
    expect(openIssues.options).toEqual([
      { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
      {
        value: 'Injury_3',
        label:
          'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
      },
      {
        value: 'Injury_11',
        label: 'May 23, 2020 - Preliminary',
      },
      {
        value: 'Injury_400',
        label: 'May 23, 2020 - Acute Concussion [N/A]',
      },
    ]);
    expect(closedIssues.label).toEqual('Prior injury/illness');
    expect(closedIssues.options).toEqual([
      {
        value: 'Injury_1',
        label:
          'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
      },
      { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_3', label: 'Feb 4, 2020 - Emotional stress' },
    ]);
  });

  it('returns the expected data when fetching athlete issues', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAthletesIssues());

    act(() => {
      result.current.fetchAthleteIssues(1);
    });
    await waitForNextUpdate();

    const [openIssues, closedIssues] = result.current.athleteIssues;
    expect(openIssues.label).toEqual('Open injury/ illness');
    expect(openIssues.options).toEqual([
      { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
      {
        value: 'Injury_3',
        label:
          'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
      },
      {
        value: 'Injury_11',
        label: 'May 23, 2020 - Preliminary',
      },
      {
        value: 'Injury_400',
        label: 'May 23, 2020 - Acute Concussion [N/A]',
      },
    ]);
    expect(closedIssues.label).toEqual('Prior injury/illness');
    expect(closedIssues.options).toEqual([
      {
        value: 'Injury_1',
        label:
          'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
      },
      { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_3', label: 'Feb 4, 2020 - Emotional stress' },
    ]);
  });

  it('returns the expected data when excludeGroup = ["prior"]', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAthletesIssues(1, ['prior'])
    );

    await waitForNextUpdate();

    const [openIssues, closedIssues] = result.current.athleteIssues;

    expect(openIssues.label).toEqual('Open injury/ illness');
    expect(openIssues.options).toEqual([
      {
        value: 'Injury_1',
        label: 'Nov 11, 2020 - Ankle Fracture (Left)',
      },
      {
        value: 'Illness_2',
        label: 'Aug 6, 2020 - Asthma and/or allergy',
      },
      {
        value: 'Injury_3',
        label:
          'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
      },
      { value: 'Injury_11', label: 'May 23, 2020 - Preliminary' },
      {
        value: 'Injury_400',
        label: 'May 23, 2020 - Acute Concussion [N/A]',
      },
    ]);
    expect(closedIssues).toEqual(undefined);
  });

  it('returns the expected data when excludeGroup = ["open"]', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAthletesIssues(1, ['open'])
    );

    await waitForNextUpdate();

    const [closedIssues, openIssues] = result.current.athleteIssues;

    expect(closedIssues.label).toEqual('Prior injury/illness');
    expect(closedIssues.options).toEqual([
      {
        value: 'Injury_1',
        label:
          'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
      },
      { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_3', label: 'Feb 4, 2020 - Emotional stress' },
    ]);
    expect(openIssues).toEqual(undefined);
  });

  it('returns the expected issueOptions when generateIssueOptions is true', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAthletesIssues(1, undefined, true)
    );

    await waitForNextUpdate();

    expect(result.current.issueOptions).toEqual([
      {
        id: 1,
        label: 'Nov 11, 2020 - Ankle Fracture (Left)',
        type: 'Injury',
        group: 'Open injury/ illness',
      },
      {
        id: 2,
        label: 'Aug 6, 2020 - Asthma and/or allergy',
        type: 'Illness',
        group: 'Open injury/ illness',
      },
      {
        id: 3,
        label:
          'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
        type: 'Injury',
        group: 'Open injury/ illness',
      },
      {
        id: 11,
        label: 'May 23, 2020 - Preliminary',
        type: 'Injury',
        group: 'Open injury/ illness',
      },
      {
        id: 400,
        label: 'May 23, 2020 - Acute Concussion [N/A]',
        type: 'Injury',
        group: 'Open injury/ illness',
      },
      {
        id: 1,
        label:
          'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
        type: 'Injury',
        group: 'Prior injury/illness',
      },
      {
        id: 2,
        label: 'Sep 13, 2020 - Ankle Fracture (Left)',
        type: 'Injury',
        group: 'Prior injury/illness',
      },
      {
        id: 3,
        label: 'Feb 4, 2020 - Emotional stress',
        type: 'Illness',
        group: 'Prior injury/illness',
      },
    ]);
  });

  it('returns the expected data when excludeGroup = ["chronic"]', async () => {
    window.featureFlags['chronic-injury-illness'] = true;
    const { result, waitForNextUpdate } = renderHook(() =>
      useAthletesIssues(1, ['chronic'])
    );

    await waitForNextUpdate();

    const [openIssues, closedIssues] = result.current.athleteIssues;

    expect(openIssues.label).toEqual('Open injury/ illness');
    expect(openIssues.options).toEqual([
      { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
      {
        value: 'Injury_3',
        label:
          'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
      },
      {
        value: 'Injury_11',
        label: 'May 23, 2020 - Preliminary',
      },
      {
        value: 'Injury_400',
        label: 'May 23, 2020 - Acute Concussion [N/A]',
      },
    ]);
    expect(closedIssues.label).toEqual('Prior injury/illness');
    expect(closedIssues.options).toEqual([
      {
        value: 'Injury_1',
        label:
          'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
      },
      { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_3', label: 'Feb 4, 2020 - Emotional stress' },
    ]);
    window.featureFlags['chronic-injury-illness'] = false;
  });

  it('returns the expected data when chronic-injury-illness feature flag is enabled', async () => {
    window.featureFlags['chronic-injury-illness'] = true;
    const { result, waitForNextUpdate } = renderHook(() =>
      useAthletesIssues(1)
    );

    await waitForNextUpdate();

    const [openIssues, closedIssues, chronicIssues] =
      result.current.athleteIssues;

    expect(openIssues.label).toEqual('Open injury/ illness');
    expect(openIssues.options).toEqual([
      { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
      {
        value: 'Injury_3',
        label:
          'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
      },
      {
        value: 'Injury_11',
        label: 'May 23, 2020 - Preliminary',
      },
      {
        value: 'Injury_400',
        label: 'May 23, 2020 - Acute Concussion [N/A]',
      },
    ]);
    expect(closedIssues.label).toEqual('Prior injury/illness');
    expect(closedIssues.options).toEqual([
      {
        value: 'Injury_1',
        label:
          'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
      },
      { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_3', label: 'Feb 4, 2020 - Emotional stress' },
    ]);
    expect(chronicIssues.label).toEqual('Chronic conditions');
    expect(chronicIssues.options).toEqual([
      { value: 'ChronicInjury_1', label: 'Unique Open Chronic Title' },
      {
        value: 'ChronicInjury_2',
        label: 'Test Chronic',
      },
      { value: 'ChronicInjury_3', label: 'Clavicle A-C Arthritis' },
      { value: 'ChronicInjury_4', label: 'Test title' },
      { value: 'ChronicInjury_5', label: 'Test title II' },
      { value: 'ChronicInjury_6', label: 'Clavicle A-C Arthritis' },
      { value: 'ChronicInjury_7', label: 'Chronic Injury II' },
    ]);
    window.featureFlags['chronic-injury-illness'] = false;
  });
});
