import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, ScrollView, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, ActionSheetIOS, Image} from 'react-native';

import HeaderLogin from './src/components/HeaderLogin';
//import SignUpScreen from './src/screens/SignUpScreen';
//import ShuffleScreen from './src/screens/ShuffleScreen';
import {FetchGet, FetchPhoto} from "./src/utils/Fetch";
import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions';
import DialogAndroid from "react-native-dialogs";
import AndroidOpenSettings from "react-native-android-open-settings";
import {createBottomTabNavigator, createStackNavigator, createAppContainer} from "react-navigation";
import {CachedImage} from 'react-native-cached-image';

/*const MyNavigator = createStackNavigator(
    {
      SignUp: SignUpScreen,
      Shuffle: ShuffleScreen,
    },
    {
      initialRouteName: 'Shuffle'
    }
);
export const Navigator = createAppContainer(MyNavigator);
*/
/*class ScreenComponentTwo extends React.Component {
  static navigationOptions = {
    headerTitle: 'Second screen',
  };

  render() {
    return (
        <View
            style={{
              flex: 1,
              justifyContent: 'center',
              borderWidth: 25,
              borderColor: 'orange',
            }}>
          <Button
              title="Go to three"
              onPress={() =>
                  this.props.navigation.navigate('SignUp', {
                  })
              }
          />
        </View>
    );
  }
}
 */

class SecondApp extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            ready: 'SignIn',
            nickname: '',
            password: '',
            sex: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            hasChanges: false,
            imagePath: null,
            galleryPermission: '',
            profilePhotoUrl: 'http://d3fjhd6pdkzg07.cloudfront.net/profile_photos/loading.gif',
            loading: false,
        };
    }

    componentDidMount(){
        this.checkGrantOfPermissions();
    }

    checkGrantOfPermissions(){
        Permissions.checkMultiple(['camera', 'photo']).then(response => {
            this.setState({
                cameraPermission: response.camera,
                galleryPermission: response.photo,
            })
        });
    }

    async openPhotoGalleryWithPermissionCheck() {
        if (this.state.galleryPermission === "undetermined") {
            Permissions.request('photo').then(response => {
                if (response === "authorized")
                    this.openGallery()
                this.setState({galleryPermission: response})
            })
        } else if (this.state.galleryPermission === "authorized") {
            this.openGallery()
        } else {
            Alert.alert(
                'Gallery access needed',
                '',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {text: 'Go to Settings', onPress: () => this.openSettings()},
                ],
                {cancelable: false},
            );
        }
    }

    async openGallery() {
        ImagePicker.openPicker({
            width: 1000,
            height: 1000,
            cropping: true,
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            cropperCircleOverlay: false,
            mediaType: 'photo',
            showCropGuidelines: false,
            cropperToolbarColor: "#4F00DB",
            cropperStatusBarColor: "#4F00DB",
            hideBottomControls: false,
            cropRect: (1000, 1000, 0, 0),
        }).then(image => {
            this.setState({imagePath: {uri: image.path}, hasChanges: true});
            this.saveImageFromGallery();
        }).catch((error) => {
            console.log('%s' % error);
        });
    }

    saveImageFromGallery = () => {
        this.setState({loading: true});
        if (this.state.imagePath !== null) {
            FetchPhoto(this.state.imagePath, function (photo_key) {
                //parameters["photo_url"] = photo_key;
                //this.updateData(parameters);
                if(this.state.ready === 'LoggedIn'){
                    FetchGet("https://0idl79raql.execute-api.us-west-1.amazonaws.com/api/update_profile_photo", {
                            "profile_photo_url": photo_key,
                        }, true, function (responseJson) {
                            console.log(responseJson);
                        }.bind(this),
                        function (error) {
                            console.log(error);
                        });
                }
                this.setState({loading: false, profilePhotoUrl: photo_key});
            }.bind(this), function (err) {
            });
        } else {
           // this.updateData(parameters);
        }
    };

    openSettings = () => {
        if (Platform.OS === 'ios')
            Permissions.openSettings();
        else
            AndroidOpenSettings.appDetailsSettings()
    };

    onPhotoButtonPress = async () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', 'Gallery'],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        this.openPhotoGalleryWithPermissionCheck()
                    }
                },
            );
        } else {
            const {selectedItem} = await DialogAndroid.showPicker('', null, {
                positiveText: null, // if positiveText is null, then on select of item, it dismisses dialog
                negativeText: 'Cancel',
                items: [
                    {label: 'Camera', id: 'camera'},
                    {label: 'Gallery', id: 'gallery'},
                ]
            });
            if (selectedItem) {
                if (selectedItem["id"] === "camera") {
                    //this.openCameraWithPermissionCheck();
                } else if (selectedItem["id"] === "gallery")
                    this.openPhotoGalleryWithPermissionCheck();
            }

        }
    };

    checkForNicknameandPassword(){
        if(this.state.nickname === '' || this.state.password === ''){
            if(this.state.ready === 'SignIn'){
                Alert.alert(
                    'Nickname and password should be entered',
                    'Please retry to login',
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'OK',
                        },
                    ],
                    {cancelable: false},
                );
                this.setState({nickname: '', password: ''});
                return false;
            }else if(this.state.ready === 'SignUp'){
                Alert.alert(
                    'Nickname and password should be entered',
                    'Please retry to sign up',
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'OK',
                        },
                    ],
                    {cancelable: false},
                );
                this.setState({nickname: '', password: '', firstName: '', lastName: '', phoneNumber: '', sex: ''});
                return false;
            }
        }
        else{
            return true;
        }
    }

    login(nickname, password) {
        if(this.checkForNicknameandPassword(this.state.ready)){
            FetchGet("https://0idl79raql.execute-api.us-west-1.amazonaws.com/api/login", {
                    "nickname": nickname,
                    "password": password,
                }, false, function (responseJson) {
                    if(responseJson['status'] === 'Authenticated'){
                        global.nickname = this.state.nickname;
                        global.password = this.state.password;
                        this.setState({ready: 'LoggedIn'})
                    }else{
                        Alert.alert(
                            'Invalid Credentials',
                            'Please retry to login',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'OK',
                                },
                            ],
                            {cancelable: false},
                        );
                    }
                }.bind(this),
                function (err) {
                }.bind(this));
        }else{
            // do nothing
        }
    }

    signUp(nickname, password, firstName, lastName, phoneNumber, sex, profilePhotoUrl) {
        if(this.checkForNicknameandPassword()){
            FetchGet("https://0idl79raql.execute-api.us-west-1.amazonaws.com/api/register/create", {
                    "nickname": nickname,
                    "password": password,
                    "first_name": firstName,
                    "last_name": lastName,
                    "phone_number": phoneNumber,
                    "sex": sex,
                    "profile_photo_url": profilePhotoUrl,
                }, false, function (responseJson) {

                    if(responseJson['status'] === 'OK'){
                        this.setState({ready: 'SignIn'});
                        Alert.alert(
                            'Account Created Successfuly!',
                            'Please sign in with your credentials.',
                            [
                                {
                                    text: 'OK',
                                    style: 'OK',
                                },
                            ],
                            {cancelable: false},
                        );
                    }else if(responseJson['status'] === 'Nickname already taken'){
                        console.log(responseJson);
                        Alert.alert(
                            'Nickname is already taken',
                            'Please retry to sign up with different nickname',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'OK',
                                },
                            ],
                            {cancelable: false},
                        );
                    }else{
                        console.log(responseJson);
                        Alert.alert(
                            'Unexpected error occured',
                            'Please retry to sign up',
                            [
                                {
                                    text: 'OK',
                                    style: 'OK',
                                },
                            ],
                            {cancelable: false},
                        );
                    }
                }.bind(this),
                function (err) {
                }.bind(this));
        }else{
            // do nothing
        }
    }

    logOut() {
        this.setState({
            ready: 'SignIn',
            nickname: '',
            password: '',
            sex: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            hasChanges: false,
            imagePath: null,
            galleryPermission: '',
            profilePhotoUrl: 'http://d3fjhd6pdkzg07.cloudfront.net/profile_photos/loading.gif',
            loading: false,
        })
    }

    stateChangeForSignIn =() => {
        this.setState({ready: 'SignUp'})
    };

    stateChangeForSignUp = () =>{
        this.setState({ready: 'SignIn'})
    };

    render() {
        if(this.state.ready === 'LoggedIn'){
            return(
            <SafeAreaView style={{flex:1 , alignItems: 'center', backgroundColor: '#F5FCFF'}}>

                    <View style={{ width: 154, height: 154, backgroundColor: "#ffffff", borderRadius: 77, shadowColor: "#000", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.08, shadowRadius: 4, zIndex: 1, elevation: 1, marginTop: 16, position: "relative", overflow: "hidden",}}>
                        <TouchableOpacity style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}}
                                          onPress={this.onPhotoButtonPress}>

                            <Image
                                source={this.state.imagePath === null ? {uri: this.state.profilePhotoUrl} : this.state.imagePath}
                                style={{width: 154, height: 154, borderRadius: 75}}
                                resizeMode={"contain"}/>

                            <View style={{top: 0, left: 0, right: 0, bottom: 0, position: "absolute", zIndex: 9, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center"}}>
                                {this.state.loading ?
                                    <View>
                                        <ActivityIndicator size="large" color="#6C69DD"/>
                                    </View>
                                    :
                                    <Image style={{width: 33, height: 33, opacity: 0.6}}
                                           resizeMode={"contain"}
                                           source={require('./src/assets/images/C2M.png')}
                                    />
                                }
                            </View>
                        </TouchableOpacity>
                    </View>

                <View style={styles.container}>
                    <TouchableOpacity style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                        marginTop: 250,
                        backgroundColor: '#6C69DD',
                        width: 180,
                        shadowOpacity: 0.9,
                        borderRadius: 50,
                    }} onPress={() => this.logOut()}>
                        <Text>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>);
        }else if(this.state.ready === 'SignIn'){
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.scrollView}>
                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'column', justifyContent: 'flex-start', backgroundColor: 'transparent'}}>
                            <HeaderLogin/>
                        </View>
                        <View style={{alignItems: 'center', flex: 1, flexDirection: 'column', justifyContent: 'flex-start', backgroundColor: 'transparent'}}>
                            <View style={{justifyContent: 'flex-start', alignItems: 'center',flexDirection:'row'}}>
                                <TextInput
                                    style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1, shadowOpacity: 0.4,}}
                                    onChangeText={(nickname) => this.setState({nickname})}
                                    value={this.state.nickname}
                                    placeholder={'nickname'}
                                    editable = {true}
                                    maxLength = {40}
                                    keyboardType='default'
                                />
                            </View>
                            <View style={{justifyContent: 'flex-start', alignItems: 'center',flexDirection:'row'}}>
                                <TextInput
                                    style={{height: 40, width: 200, borderColor: 'gray', marginTop: 10, borderWidth: 1, shadowOpacity: 0.4,}}
                                    onChangeText={(password) => this.setState({password})}
                                    value={this.state.password}
                                    placeholder={'password'}
                                    editable = {true}
                                    maxLength = {40}
                                    secureTextEntry={true}
                                    keyboardType='default'
                                />
                            </View>
                            <TouchableOpacity style={{
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 10,
                                backgroundColor: '#6C69DD',
                                width: '45%',
                                shadowOpacity: 0.9,
                                borderRadius: 50,
                            }} onPress={() => this.login(this.state.nickname, this.state.password)}>
                                <Text>Sign In</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                height: 15,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '45%',
                            }} onPress={this.stateChangeForSignIn}>
                                <Text style={{color: 'red'}}>Create a new account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            );
        }else if(this.state.ready === 'SignUp'){
            return(
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={{flexDirection: "column", alignItems: "center"}}>
                        <View style={{width: 154, height: 154, backgroundColor: "#ffffff", borderRadius: 77, shadowColor: "#000", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.08, shadowRadius: 4, zIndex: 1, elevation: 1, marginTop: 16, position: "relative", overflow: "hidden",}}>
                            <TouchableOpacity style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}}
                                              onPress={this.onPhotoButtonPress}>



                                <CachedImage
                                    source={this.state.imagePath === null ? {uri: this.state.profilePhotoUrl} : this.state.imagePath}
                                    style={{width: 154, height: 154, borderRadius: 77}}
                                    resizeMode={"contain"}/>

                                <View style={{top: 0, left: 0, right: 0, bottom: 0, position: "absolute", zIndex: 9, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center"}}>
                                    {this.state.loading ?
                                        <View>
                                            <ActivityIndicator size="large" color="#6C69DD"/>
                                        </View>
                                        :
                                        <Image style={{width: 33, height: 33, opacity: 0.6}}
                                               resizeMode={"contain"}
                                               source={require('./src/assets/images/C2M.png')}
                                        />
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{alignItems: 'center', flex: 1, flexDirection: 'column', justifyContent: 'flex-start', marginTop: 10}}>
                        <View style={{justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'}}>
                            <TextInput
                                style={{
                                    height: 40,
                                    width: 200,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    shadowOpacity: 0.4,
                                }}
                                onChangeText={(nickname) => this.setState({nickname})}
                                value={this.state.nickname}
                                placeholder={'nickname*'}
                                editable={true}
                                maxLength={40}
                                keyboardType='default'
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <TextInput
                                style={{
                                    height: 40,
                                    width: 200,
                                    borderColor: 'gray',
                                    marginTop: 10,
                                    borderWidth: 1,
                                    shadowOpacity: 0.4,
                                }}
                                onChangeText={(password) => this.setState({password})}
                                value={this.state.password}
                                placeholder={'password*'}
                                editable={true}
                                maxLength={40}
                                secureTextEntry={true}
                                keyboardType='default'
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <TextInput
                                style={{
                                    height: 40,
                                    width: 200,
                                    borderColor: 'gray',
                                    marginTop: 10,
                                    borderWidth: 1,
                                    shadowOpacity: 0.4,
                                }}
                                onChangeText={(firstName) => this.setState({firstName})}
                                value={this.state.firstName}
                                placeholder={'first name*'}
                                editable={true}
                                maxLength={40}
                                keyboardType='default'
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <TextInput
                                style={{
                                    height: 40,
                                    width: 200,
                                    borderColor: 'gray',
                                    marginTop: 10,
                                    borderWidth: 1,
                                    shadowOpacity: 0.4,
                                }}
                                onChangeText={(lastName) => this.setState({lastName})}
                                value={this.state.lastName}
                                placeholder={'last name*'}
                                editable={true}
                                maxLength={40}
                                keyboardType='default'
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <TextInput
                                style={{
                                    height: 40,
                                    width: 200,
                                    borderColor: 'gray',
                                    marginTop: 10,
                                    borderWidth: 1,
                                    shadowOpacity: 0.4,
                                }}
                                onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                value={this.state.phoneNumber}
                                placeholder={'phone number*'}
                                editable={true}
                                maxLength={40}
                                keyboardType='default'
                            />
                        </View>
                        <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
                            <TouchableOpacity style={{
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 10,
                                backgroundColor: '#6C69DD',
                                width: 180,
                                shadowOpacity: 0.9,
                                borderRadius: 50,
                            }} onPress={() => this.signUp(this.state.nickname, this.state.password, this.state.firstName, this.state.lastName, this.state.phoneNumber, this.state.sex, this.state.profilePhotoUrl)}>
                                <Text>Sign Up</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                height: 17,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '45%',
                            }} onPress={this.stateChangeForSignUp}>
                                <Text style={{color: 'red'}}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
         );
        }
    }
}

export default class App extends Component<Props> {
    render(){
        return(
            <SecondApp/>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
