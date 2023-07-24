import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, SafeAreaView, View, StyleSheet, Linking, KeyboardAvoidingView } from 'react-native';
import { Searchbar, FAB, Text, Appbar } from 'react-native-paper';
import { getDocs } from 'firebase/firestore';
import { notesReference} from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../components/theme';
// import { Platform } from 'react-native';

const ShareNotesScreen = ({mockFunction}) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([])
  
  //need this when conducting unit tests in nodejs without the emulator
  // let platform;
  // if (Platform != undefined) {
  //   platform = Platform;
  // } else {
  //   platform = {OS: 'ios'}
  // }

  const handleDownload = (url) => {
    Linking.openURL(url);
  }

  const navigation = mockFunction? mockFunction : useNavigation();
  const sizeInMB = (sizeInBytes) => (sizeInBytes / (1024 * 1024)).toFixed(2);
  
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const noteSnapshot = await getDocs(notesReference);
      const noteList = noteSnapshot.docs.map(doc => doc.data());
      setNotes(noteList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  

  useEffect(() => { 
    fetchNotes();
  }, []);

  useEffect(() => {
    if (search === '') {
      setFiltered(notes);
    } else {
      const filteredNotes = notes.filter(note => note.name.toLowerCase().includes(search.toLowerCase()));
      setFiltered(filteredNotes);
    }
  }, [search, notes]);

  return (
    <SafeAreaView
    style={{ flex: 1 }}>
 
      <Appbar.Header mode={'center-aligned'}style={{ backgroundColor: theme.colors.primary}}>
        <Appbar.Content 
          title="Share Notes With the Community!" 
          color="#f0f8ff"
          titleStyle={{ fontSize: 18 }} 
        />
      </Appbar.Header>
      
      <Searchbar
        testID="search"
        style={{marginTop: 20, marginBottom: 20, width: '90%', alignSelf: 'center'}}
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
      /> 
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator animating={true} />
        </View>
      ) : (
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#D3D3D3' }}>
            <Text style={{ flex: 2 }}>Name</Text>
            <Text style={{ flex: 1 }}>Author</Text>
            <Text style={{ flex: 1 }}>Size (MB)</Text>
            <Text style={{ flex: 1 }}>Download</Text>
          </View>
          {filtered.length === 0 && search.length === 0 ? (
            notes.map((note, index) => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }} key={index}>
                <Text style={{ flex: 2 }}>{note.name}</Text>
                <Text style={{ flex: 1 }}>{note.author}</Text>
                <Text style={{ flex: 1 }}>{sizeInMB(note.size)}</Text>
                <Ionicons name="md-download" size={24} color={theme.colors.primary} style={{ flex: 1, textAlign: 'center'  }} onPress={() => handleDownload(note.file)} />
              </View>
            ))
          ) : (
            filtered.map((note, index) => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }} key={index}>
                <Text style={{ flex: 2 }}>{note.name}</Text>
                <Text style={{ flex: 1 }}>{note.author}</Text>
                <Text style={{ flex: 1, textAlign: 'center' }}>{sizeInMB(note.size)}</Text>
                <Ionicons name="md-download" size={24} color={theme.colors.primary} style={{ flex: 1, textAlign: 'center' }} onPress={() => handleDownload(note.file)} />
              </View>
            ))
          )}
        </ScrollView>
      )}

      <FAB
        testID='FAB'
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        small
        icon="plus"
        onPress={() => navigation.navigate('UploadNotes')}
      />
    </SafeAreaView>
  )
}


export default ShareNotesScreen;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    inputContainer: {
      width: '80%',
      alignSelf: 'center',
      margin: 10 
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
    },
    fileNameInfo: {
      color: 'grey',
      marginTop: 10,
      fontSize: 14,
      fontStyle: 'italic',
      textAlign: 'center',
      marginHorizontal: 20,
  },
  buttonContainer: {
      width: '70%',
      alignSelf: 'center',
      margin: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    marginTop: 20,
    alignSelf: 'center',
    textAlign: 'center',
    color: theme.colors.primary
  },
})