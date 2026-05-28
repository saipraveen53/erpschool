import * as DocumentPicker from 'expo-document-picker';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function BulkUpload() {
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['text/csv', 'application/vnd.ms-excel'] });
      if (result.assets) Alert.alert('Success', `File selected: ${result.assets[0].name}`);
    } catch (err) { Alert.alert('Error', 'File selection failed'); }
  };
  return (
    <View className="flex-1 bg-white p-4 justify-center">
      <Text className="text-2xl font-bold text-center mb-4">Bulk Student Upload</Text>
      <Text className="text-gray-600 text-center mb-6">Upload CSV/Excel file with student data</Text>
      <TouchableOpacity onPress={pickFile} className="bg-blue-600 py-3 rounded-lg mb-4"><Text className="text-white text-center">Select File</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => Alert.alert('Download Sample')}><Text className="text-blue-600 text-center">Download Sample CSV</Text></TouchableOpacity>
    </View>
  );
}