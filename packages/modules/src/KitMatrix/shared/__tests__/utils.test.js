import {
  getFileInfo,
  getEquipmentError,
  getDefaultErrorTextEnumLike,
  getPlayerTypesEnumLike,
} from '../utils';

describe('kit matrix utils', () => {
  const defaultErrorTextEnum = getDefaultErrorTextEnumLike();

  describe('getFileInfo', () => {
    it('should resolve with file information when provided with a valid file', async () => {
      const mockFile = new File(['mock image'], 'image.jpg', {
        type: 'image/jpg',
      });
      const fileInfo = await getFileInfo(mockFile);

      expect(fileInfo).toEqual({
        url: fileInfo.url,
        name: 'image.jpg',
        type: 'image/jpg',
      });
    });

    it('resolves with empty string if there is an error reading the file', async () => {
      jest.spyOn(window, 'FileReader').mockImplementation(() => {
        return {
          readAsDataURL: jest.fn(() => {
            throw new Error('Something went wrong');
          }),
        };
      });

      const mockFile = new File(['mock image'], 'image.jpg', {
        type: 'image/jpg',
      });
      const fileInfo = await getFileInfo(mockFile);
      expect(fileInfo).toEqual('');
    });

    it('resolves with an empty string if an incorrect file is passed to the function', async () => {
      expect(await getFileInfo()).toEqual('');
      expect(await getFileInfo(null)).toEqual('');
      expect(await getFileInfo(undefined)).toEqual('');
      expect(await getFileInfo([])).toEqual('');
      expect(await getFileInfo(1)).toEqual('');
    });
  });

  describe('getEquipmentError', () => {
    const mockFileInfo = {
      name: 'mockImage.png',
      size: 12345,
      type: 'image/png',
    };

    it('should return an error if equipment color is missing', () => {
      const result = getEquipmentError({
        image: mockFileInfo,
        errors: {
          colorId: null,
          image: null,
        },
      });
      expect(result).toEqual({
        colorId: defaultErrorTextEnum.equipmentColor,
        image: null,
      });
    });
    it('should return an error if equipment image is missing', () => {
      const result = getEquipmentError({
        colorId: 1,
        errors: {
          colorId: null,
          image: null,
        },
      });
      expect(result).toEqual({
        colorId: null,
        image: defaultErrorTextEnum.unsupportedFile,
      });
    });

    it('should return null when there are no errors', () => {
      const result = getEquipmentError({
        colorId: 1,
        image: mockFileInfo,
        errors: {
          colorId: null,
          image: null,
        },
      });
      expect(result).toBeNull();
    });
  });
  describe('getPlayerTypesEnumLike', () => {
    afterEach(() => {
      window.setFlag('league-ops-kit-management-v2', false);
    });

    it('should return the correct player types enum like', () => {
      expect(getPlayerTypesEnumLike()).toEqual({
        player: { label: 'Outfield Player', value: 'player' },
        goalkeeper: { label: 'Goalkeeper', value: 'goalkeeper' },
        referee: { label: 'Referee', value: 'referee' },
      });
    });
    it('should return the correct player types enum like when the league-ops-kit-management-v2 flag is true', () => {
      window.setFlag('league-ops-kit-management-v2', true);
      expect(getPlayerTypesEnumLike()).toEqual({
        player: { label: 'Player', value: 'player' },
        goalkeeper: { label: 'Goalkeeper', value: 'goalkeeper' },
        referee: { label: 'Referee', value: 'referee' },
      });
    });
  });
});
