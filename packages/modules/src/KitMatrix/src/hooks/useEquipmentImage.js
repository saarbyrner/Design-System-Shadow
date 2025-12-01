// @flow
import { useRef } from 'react';
import type {
  EquipmentName,
  FileInfo,
} from '@kitman/modules/src/KitMatrix/shared/types';
import type { FileUploadsFile } from '@kitman/playbook/components/FileUploads';
import type { QueuedItemType } from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import { getEquipmentsEnumLike } from '@kitman/modules/src/KitMatrix/shared/utils';

type UseEquipmentImageProps = {
  onChangeEquipmentImage: (
    equipmentName: EquipmentName,
    file?: File
  ) => Promise<void>,
};

type UseEquipmentImageReturn = {
  jerseyFilePondRef: { current: any },
  shortsFilePondRef: { current: any },
  socksFilePondRef: { current: any },
  handleFileAdd: (
    equipmentName: EquipmentName,
    attachedFile: FileUploadsFile
  ) => void,
  createQueuedItemFromImage: (
    image: FileInfo,
    equipmentName: EquipmentName
  ) => QueuedItemType,
};

// hook to handle the equipment image upload
export const useEquipmentImage = ({
  onChangeEquipmentImage,
}: UseEquipmentImageProps): UseEquipmentImageReturn => {
  const jerseyFilePondRef = useRef(null);
  const shortsFilePondRef = useRef(null);
  const socksFilePondRef = useRef(null);
  const equipmentsEnum = getEquipmentsEnumLike();

  // handle the file add event for the equipment image
  const handleFileAdd = (
    equipmentName: EquipmentName,
    attachedFile: FileUploadsFile
  ) => {
    onChangeEquipmentImage(equipmentName, attachedFile.file).then(() => {
      // clear the FilePond after successful upload
      const refMap = {
        [equipmentsEnum.jersey.value]: jerseyFilePondRef,
        [equipmentsEnum.shorts.value]: shortsFilePondRef,
        [equipmentsEnum.socks.value]: socksFilePondRef,
      };
      const filePondRef = refMap[equipmentName];
      if (filePondRef.current) {
        filePondRef.current.removeFiles();
      }
    });
  };

  const createQueuedItemFromImage = (
    image: FileInfo,
    equipmentName: EquipmentName
  ): QueuedItemType => {
    // create a stable ID based on equipment name and image name
    const stableId = `${equipmentName}-${image.name}`;
    return {
      state: 'SUCCESS',
      file: {
        filename: image.name,
        fileType: image.type,
        fileSize: 0,
        blobUrl: image.url,
        file: new File([], image.name),
        id: stableId,
        filenameWithoutExtension:
          image.name.split('.').slice(0, -1).join('.') || image.name,
        createdDate: null,
      },
      message: null,
    };
  };

  return {
    jerseyFilePondRef,
    shortsFilePondRef,
    socksFilePondRef,
    handleFileAdd,
    createQueuedItemFromImage,
  };
};
