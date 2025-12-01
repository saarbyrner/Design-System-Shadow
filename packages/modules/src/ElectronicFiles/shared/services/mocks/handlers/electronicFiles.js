// @flow
import { rest } from 'msw';
import { data as createPresignedAttachmentsData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/createPresignedAttachments.mock';
import { data as sendElectronicFileData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/sendElectronicFile.mock';
import { data as searchInboundElectronicFileListData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';
import { data as fetchInboundElectronicFileData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import { data as searchOutboundElectronicFileListData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchOutboundElectronicFileList.mock';
import { data as fetchOutboundElectronicFileData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchOutboundElectronicFile.mock';
import { data as getUnreadCountData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/getUnreadCount.mock';
import { data as updateViewedData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/updateViewed.mock';
import { data as updateArchivedData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/updateArchived.mock';
import { data as splitDocumentData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/splitDocument.mock';
import { endpoint as createPresignedAttachmentsEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/createPresignedAttachments';
import { endpoint as sendElectronicFileEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/sendElectronicFile';
import { endpoint as searchInboundElectronicFileListEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/searchInboundElectronicFileList';
import { generateEndpointUrl as fetchInboundElectronicFileEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchInboundElectronicFile';
import { endpoint as searchOutboundElectronicFileListEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/searchOutboundElectronicFileList';
import { generateEndpointUrl as fetchOutboundElectronicFileEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/fetchOutboundElectronicFile';
import { endpoint as updateViewedEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateViewed';
import { endpoint as getUnreadCountEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/getUnreadCount';
import { endpoint as updateArchivedEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/updateArchived';
import { generateEndpointUrl as splitDocumentEndpoint } from '@kitman/modules/src/ElectronicFiles/shared/services/api/splitDocument';

const handlers = [
  rest.post(createPresignedAttachmentsEndpoint, (req, res, ctx) =>
    res(ctx.json(createPresignedAttachmentsData))
  ),
  rest.post(sendElectronicFileEndpoint, (req, res, ctx) =>
    res(ctx.json(sendElectronicFileData))
  ),
  rest.post(searchInboundElectronicFileListEndpoint, (req, res, ctx) =>
    res(ctx.json(searchInboundElectronicFileListData))
  ),
  rest.get(fetchInboundElectronicFileEndpoint(1), (req, res, ctx) =>
    res(ctx.json(fetchInboundElectronicFileData))
  ),
  rest.post(fetchInboundElectronicFileEndpoint(1), (req, res, ctx) =>
    res(ctx.json(fetchInboundElectronicFileData))
  ),
  rest.post(searchOutboundElectronicFileListEndpoint, (req, res, ctx) =>
    res(ctx.json(searchOutboundElectronicFileListData))
  ),
  rest.get(fetchOutboundElectronicFileEndpoint(1), (req, res, ctx) =>
    res(ctx.json(fetchOutboundElectronicFileData))
  ),
  rest.post(fetchOutboundElectronicFileEndpoint(1), (req, res, ctx) =>
    res(ctx.json(fetchOutboundElectronicFileData))
  ),
  rest.get(getUnreadCountEndpoint, (req, res, ctx) =>
    res(ctx.json(getUnreadCountData))
  ),
  rest.patch(updateViewedEndpoint, (req, res, ctx) =>
    res(ctx.json(updateViewedData))
  ),
  rest.patch(updateArchivedEndpoint, (req, res, ctx) =>
    res(ctx.json(updateArchivedData))
  ),
  rest.post(splitDocumentEndpoint(1), (req, res, ctx) =>
    res(ctx.json(splitDocumentData))
  ),
];

export {
  handlers,
  createPresignedAttachmentsData,
  sendElectronicFileData,
  searchInboundElectronicFileListData,
  fetchInboundElectronicFileData,
  searchOutboundElectronicFileListData,
  fetchOutboundElectronicFileData,
  getUnreadCountData,
  updateViewedData,
  updateArchivedData,
  splitDocumentData,
};
