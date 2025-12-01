import { handlers as contactsHandlers } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/handlers/contacts';
import { handlers as electronicFilesHandlers } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/handlers/electronicFiles';

export default [...contactsHandlers, ...electronicFilesHandlers];
