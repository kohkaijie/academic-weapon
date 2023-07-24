import { StyleSheet, View, SafeAreaView, ScrollView, Modal, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import IndividualCard from '../components/Card'
import {Text, ActivityIndicator, Button, Searchbar, Appbar} from 'react-native-paper';
import {getAllUsers} from '../utils/userProfile';
import {auth} from '../firebase';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import theme from '../components/theme';

const HomeScreen = () => {

  const [loading, setLoading] = useState(false);
  const [profilesArray, setProfilesArray] = useState(null);
  const [showFilter, setShowFilter] = useState(false); 
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStudySpot, setSelectedStudySpot] = useState('');
  const [willingToTeachFilter, setWillingToTeachFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [filtersApplied, setFiltersApplied] = useState(0); 
  const [allProfiles, setAllProfiles] = useState(null);
  



  const fetchProfiles = async () => {
    setLoading(true);
    try {
      let profiles;
      let filteredProfiles;
      if (allProfiles) {
        profiles = allProfiles //dont fetch data from database unless it's needed
      } else {
        profiles = await getAllUsers(auth.currentUser.uid);
        setAllProfiles(profiles);
      }
  
      if (selectedSchool || selectedCourse || selectedYear || selectedStudySpot || search || willingToTeachFilter) {
          let preProcessedSearch = search.toLowerCase().trim(); // remove capitalization and white space
          filteredProfiles = profiles.filter(x => 
            x.school.includes(selectedSchool) && 
            x.course.includes(selectedCourse) &&
            x.yearOfStudy.includes(selectedYear) && 
            x.studySpot.includes(selectedStudySpot) && 
            x.name.toLowerCase().includes(preProcessedSearch) &&
            (willingToTeachFilter ? x.willingToTeach === true : true))
  
          setProfilesArray(filteredProfiles);
  
      } else {
          setProfilesArray(profiles);
      }    
    } catch(error) {
        alert(error);
    
    } finally { 
        setLoading(false);
    }
  }
  


  useEffect(() => {
    fetchProfiles();
  }, [selectedSchool, selectedCourse, selectedYear, selectedStudySpot, search, willingToTeachFilter, filtersApplied]);


  const RenderCards = ({array}) => {
    if (array?.length > 0) {
      return array.map((user, index) => <IndividualCard key={user.id || index} name={user.name} gender={user.gender} course={user.course} bio={user.bio}
        modules={user.modules} school={user.school} yearOfStudy={user.yearOfStudy} studySpot={user.studySpot} image={user.image} uid={user.userId} willingToTeach={user.willingToTeach}/> )
    } else {
      return <Text style={{fontSize:30, alignSelf:'center', marginTop: 100}}>No users found!</Text>
    }
  } 

  const handleSchoolChange = (school) => {
    setSelectedSchool(school);
  }

  const handleCourseChange = (course) => {
    setSelectedCourse(course);
  }

  const handleYearChange = (year) => {
    setSelectedYear(year);
  }

  const handleStudyChange = (study) => {
    setSelectedStudySpot(study);
  }

  const handleApplyFilters = () => {

    setFiltersApplied(filtersApplied + 1);
    setShowFilter(false);
  }

  const handleRemoveFilters = () => {
    setFiltersApplied(false);
    setSelectedSchool('');
    setSelectedCourse('');
    setSelectedYear('');
    setSelectedStudySpot('');
    setWillingToTeachFilter(false);
  }
    
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header testID='banner' mode={'center-aligned'} style={{ backgroundColor: theme.colors.primary}}>
          <Appbar.Content title="Find your Study Buddy today!" color={`#f0f8ff`}/>  
      </Appbar.Header>
       
            {showFilter && (  
               <Modal
               animationType="slide"
               transparent={false}
               visible={showFilter}
               onRequestClose={() => setShowFilter(false)}
              >
                <SafeAreaView>
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowFilter(false)}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <ScrollView> 

                <Text variant='labelLarge' style={{alignSelf:'center', marginTop:20, fontWeight:'bold'}}>Search for a name!</Text>
                  <Searchbar
                    style={{marginTop: 20, marginBottom: 15, width: '90%', alignSelf:'center'}}
                    placeholder="Search"
                    value={search}
                    onChangeText={setSearch}
                  />
                 
                  <Text variant='labelLarge' style={styles.select}>Select School</Text>
                  <View style={styles.picker}>
                    <Picker
                      selectedValue={selectedSchool}
                      onValueChange={handleSchoolChange}
                    >
                      <Picker.Item label="All" value='' />
                      <Picker.Item label="NTU" value="ntu" />
                      <Picker.Item label="NUS" value="nus" />
                      <Picker.Item label="SIM" value="sim" />
                      <Picker.Item label="SMU" value="smu" />
                      <Picker.Item label="SUTD" value="sutd" />
                      <Picker.Item label="SUSS" value="suss" />
                    </Picker>
                  </View>

                  <Text variant='labelLarge' style={styles.select}>Select Course</Text>
                  <View style={styles.picker}>
                    <Picker
                      selectedValue={selectedCourse}
                      onValueChange={handleCourseChange}
                    >
                        <Picker.Item label="All" value="" />
                        <Picker.Item label="Architecture" value="architecture" />
                        <Picker.Item label="Arts" value="arts" />
                        <Picker.Item label="Business" value="business" />
                        <Picker.Item label="Computing" value="computing" />
                        <Picker.Item label="Dentistry" value="dentistry" />
                        <Picker.Item label="Education" value="education" />
                        <Picker.Item label="Healthcare" value="healthcare" />
                        <Picker.Item label="Law" value="law" />
                        <Picker.Item label="Math" value="math" />
                        <Picker.Item label="Medicine" value="medicine" />
                        <Picker.Item label="Science" value="science" />
                        <Picker.Item label="Others" value="others" />
                  </Picker>
                  </View>
                  
                  <Text variant='labelLarge' style={styles.select}>Select Year</Text>
                  <View style={styles.picker}>
                    <Picker selectedValue={selectedYear} onValueChange={handleYearChange}>
                        <Picker.Item label="All" value='' />
                        <Picker.Item label="1" value="1" />
                        <Picker.Item label="2" value ="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value ="4" />
                        <Picker.Item label="Post-grad" value ="postgrad" />
                    </Picker>
                  </View>

                  <Text variant='labelLarge' style={styles.select}>Select Study Spot</Text>
                  <View style={styles.picker}>
                    <Picker selectedValue={selectedStudySpot} onValueChange={handleStudyChange}>
                        <Picker.Item label="All" value='' />
                        <Picker.Item label="In School" value="school" />
                        <Picker.Item label="Libraries" value="libraries" />
                        <Picker.Item label="Cafes" value="cafes" />
                    </Picker>
                  </View>

                  <Text variant='labelLarge' style={styles.select}>Willing to Teach</Text>
                  <View style={styles.picker}>
                    <Picker selectedValue={willingToTeachFilter} onValueChange={setWillingToTeachFilter}>
                      <Picker.Item label="All" value={false} />
                      <Picker.Item label="Willing to Teach" value={true} />
                    </Picker>
                  </View>


                  <Button title="Apply Filters" onPress={handleApplyFilters}>
                    Apply Filters
                  </Button>

                  <Button title="Remove Filters" onPress={handleRemoveFilters}>
                    Remove Filters
                  </Button>

                  <Button title="Close Filter" onPress={() => setShowFilter(false)}>
                    Close 
                  </Button>

                </ScrollView>
                </SafeAreaView>
              </Modal>
            )}



      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator animating={true} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollview}>
         
        <Button testID='filter' title="Filter by school" onPress={() => setShowFilter(!showFilter)}> 
           Filter
          </Button>


          
          <View testID='cards'>
            <RenderCards array={profilesArray}/>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
  
}

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollview: {
    flexGrow: 1,
  },
  headline: {
    marginTop: 20,
    marginBottom:5,
    alignSelf: 'center',
    textAlign: 'center',
    color: theme.colors.primary
  },
  closeButton: {
    position: 'absolute', 
    right: 10, 
    top: 20, 
    zIndex: 1
  }, 
  picker: {
    backgroundColor: theme.colors.secondaryContainer, 
    width: '90%', 
    alignSelf: 'center', 
    borderRadius: 10 
  },
  select: {
    alignSelf: 'center',
    marginTop: 5,
    fontWeight: 'bold'
  }
});