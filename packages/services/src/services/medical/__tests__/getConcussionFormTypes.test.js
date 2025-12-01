import getConcussionFormTypes from '../getConcussionFormTypes';
import {
  pac12Forms,
  ISUForms,
  NBAForms,
  PLForms,
} from '../../../mocks/handlers/medical/getConcussionFormTypes';

describe('getConcussionFormTypes', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getConcussionFormTypes({
      group: 'pac_12',
      category: 'medical',
    });

    expect(returnedData).toEqual(pac12Forms);
  });

  it('calls the correct endpoint for ISU forms and returns the correct value', async () => {
    const returnedData = await getConcussionFormTypes({
      group: 'isu',
      category: 'legal',
    });

    expect(returnedData).toEqual(ISUForms);
  });

  it('calls the correct endpoint for NBA forms and returns the correct value', async () => {
    const returnedData = await getConcussionFormTypes({
      group: 'nba',
      category: 'medical',
    });

    expect(returnedData).toEqual(NBAForms);
  });

  it('calls the correct endpoint for PL forms and returns the correct value', async () => {
    const returnedData = await getConcussionFormTypes({
      group: 'pl',
      category: 'medical',
    });

    expect(returnedData).toEqual(PLForms);
  });
});
