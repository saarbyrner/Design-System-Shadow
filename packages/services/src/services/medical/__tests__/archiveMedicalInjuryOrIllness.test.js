import { axios } from '@kitman/common/src/utils/services';
import { getIssueTypePath } from '@kitman/modules/src/Medical/shared/utils';
import archiveMedicalInjuryOrIllness from '../archiveMedicalInjuryOrIllness';

describe('archiveMedicalInjuryOrIllness', () => {
  const athleteId = 1;
  const issueId = 1;
  const archiveReasonId = 1;

  let archiveMedicalInjuryOrIllnessRequest;

  beforeEach(() => {
    archiveMedicalInjuryOrIllnessRequest = jest
      .spyOn(axios, 'patch')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: '', status: 200 });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint - Injury', async () => {
    const issueType = 'Injury';
    const issueTypePath = getIssueTypePath(issueType);
    const returnedData = await archiveMedicalInjuryOrIllness(
      athleteId,
      issueId,
      issueType,
      archiveReasonId
    );

    expect(returnedData.data).toEqual('');
    expect(returnedData.status).toEqual(200);

    expect(archiveMedicalInjuryOrIllnessRequest).toHaveBeenCalledTimes(1);
    expect(archiveMedicalInjuryOrIllnessRequest).toHaveBeenCalledWith(
      `/athletes/${athleteId}/${issueTypePath}/${issueId}/archive`,
      { archive_reason_id: 1 }
    );
  });

  it('calls the correct endpoint - Illness', async () => {
    const issueType = 'Illness';
    const issueTypePath = getIssueTypePath(issueType);
    const returnedData = await archiveMedicalInjuryOrIllness(
      athleteId,
      issueId,
      issueType,
      archiveReasonId
    );

    expect(returnedData.data).toEqual('');
    expect(returnedData.status).toEqual(200);

    expect(archiveMedicalInjuryOrIllnessRequest).toHaveBeenCalledTimes(1);
    expect(archiveMedicalInjuryOrIllnessRequest).toHaveBeenCalledWith(
      `/athletes/${athleteId}/${issueTypePath}/${issueId}/archive`,
      { archive_reason_id: 1 }
    );
  });
});
