import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, SafeAreaView, View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar  } from 'react-native-paper';
import { getDocs, addDoc } from 'firebase/firestore';
import { notesReference} from '../firebase';
import {pickFile, uploadFileToFirebase} from '../utils/fileUpload';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';



const UploadNotesScreen = () => {

    const [author, setAuthor] = useState("");
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [size, setSize] = useState(0);

    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const navigation = useNavigation();
    
    const handleUploadFile = async () => {
        if (file == null || fileName == "" || author == "") {
            alert("Please enter all fields")
            return
        }
        
        setLoading(true);
        try {
            const fileUrl = await uploadFileToFirebase(file);

            const notesDetails = {
                author: author, 
                name: fileName,
                date: Date.now(),
                file: fileUrl,
                size: file.size
            }
 
            addDoc(notesReference, notesDetails)
                .then(() => {


                    onToggleSnackBar();
                    console.log('Notes uploaded successfully!');
                    //navigation.navigate("HomeScreen")
                })
                .catch((error) => {
                    console.error('Error creating profile:', error);
                });

        } catch (error) {
            alert("Could not upload document");
            console.log(error)
        } finally {
            setLoading(false);
        }

    }

    return (
       
    <SafeAreaView style={{ flex: 1, justiifyContent:'center'}}>

        <BackButton />
        <Text style={{fontSize: 20, marginTop: 80, marginBottom: 30, alignSelf: 'center'}}> 
            Upload Your Notes to Share With The World!
        </Text>

        {loading ? (
            <View style={styles.centered}>
                <ActivityIndicator animating={true} />
            </View>
        ): (
            <View>
                <View style={styles.inputContainer}>
                <TextInput
                    dense={true}
                    style={styles.input}
                    label="Your Name"
                    value={author}
                    onChangeText={setAuthor}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    dense={true}
                    style={styles.input}
                    label="File Name"
                    value={fileName}
                    onChangeText={setFileName}
                />
                <Text style={styles.fileNameInfo}> If applicable, try to use the format: School _ Module _ Year _ Name
                For instance, NUS_CS2030S_2023_Midterms_Cheatsheet. This will make it easier for others to find!</Text>
                
            </View>

            
            <View style={styles.buttonContainer}>
                <Button  title="Pick file" onPress={async () => {
                    const file = await pickFile();
                    if (file) {
                        setFile(file);
                    }
                }}>
                        Pick a file from your device!
                </Button>

                <View style={{alignItems: 'center'}}>
                    {file && <Text> {fileName ? fileName: file.name}.pdf selected </Text>}
                    
                </View>

                

            </View>
            
            <View style={styles.buttonContainer}>
                <Button onPress={handleUploadFile} mode="contained">  
                    Share Notes
                </Button>
            </View>
            

            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                onPress: () => {
                    // Do something
                },
                }}>
                Uploaded Notes Successfully!
            </Snackbar>
        </View>
        )}
        
    </SafeAreaView>
    );

}

export default UploadNotesScreen;

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
})