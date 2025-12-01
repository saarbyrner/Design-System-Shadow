import extractDataSources from '../formResultsDataSourceExtractor';
import careDemographicMock from './mocks/careDemographicMock';
import concussionIncidentMock from './mocks/concussionIncidentMock';
import concussionRtpMock from './mocks/concussionRtpMock';
import generalMedicalMock from './mocks/generalMedicalMock';
import prophylacticAnkleSupportV3Mock from './mocks/prophylacticAnkleSupportV3.mock';

describe('extractDataSources', () => {
  test.each([
    [careDemographicMock, ['countries']],
    [concussionIncidentMock, ['injuries', 'timezones']],
    [concussionRtpMock, ['injuries']],
    [generalMedicalMock, ['medical_document_categories']],
    [prophylacticAnkleSupportV3Mock, ['game_events', 'footwear_v2s']],
  ])('correctly finds the needed data sources', (formData, expected) => {
    const result = extractDataSources(formData);
    expect(result).toEqual(expected);
  });
});
