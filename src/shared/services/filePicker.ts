import { NativeModules } from 'react-native';

const { FilePicker } = NativeModules;

interface PickedFile {
  path: string;
  name: string;
}

export const pickFile = async (): Promise<PickedFile> => {
  return await FilePicker.pickFile();
};
