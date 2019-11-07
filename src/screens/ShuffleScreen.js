import React, {Component} from 'react';
import {
    Button,
    Text,
    View,
    Platform,
    Animated,
    Easing,
    StyleSheet,
    Dimensions,
    Image,
    PanResponder,
    TouchableOpacity
} from 'react-native';
import {ScrollView} from "react-navigation";

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default class ShuffleScreen extends React.Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            headerMode: 'none',
            headerVisible: false,
            title: params ? params.nickname : 'C2M',
            /* These values are used instead of the shared configuration! */
            headerStyle: {
                backgroundColor: navigationOptions.headerTintColor,
            },
            //headerTintColor: navigationOptions.headerStyle.backgroundColor,
            headerRight: (
                <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{marginLeft: 5, marginRight: 5}}>
                        <Button
                            onPress={() => alert('This is a button!')}
                            title="Info"
                            color= {Platform.OS === 'ios'? 'red' : 'blue'}
                            style={{marginRight: 20}}
                        />
                    </View>
                    <View>
                        <Button
                            onPress={() => alert('This is a button!')}
                            title="Info"
                            color= {Platform.OS === 'ios'? 'red' : 'blue'}
                        />
                    </View>
                </View>
            ),
        };
    };

    constructor () {
        super()

    }

    componentDidMount () {

    }

    state = {
        isScrollEnabled: false
    }

    componentWillMount() {
        this.scrollOffset = 0
        this.animation = new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 90})
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                if((this.state.isScrollEnabled && this.scrollOffset <= 0 && gestureState.dy> 0) || (!this.state.isScrollEnabled && gestureState.dy<= 0)){
                    return true
                }else{
                    return false
                }
            },
            onPanResponderGrant: (evt, gestureState) => {
                this.animation.extractOffset()
            },
            onPanResponderMove: (evt, gestureState) => {
                this.animation.setValue({x:0, y: gestureState.dy})
            },
            onPanResponderRelease: (evt, gestureState) => {
                if(gestureState.moveY > SCREEN_HEIGHT - 120){
                    Animated.spring(this.animation.y, {
                        toValue: 0,
                        tension:1
                    }).start()
                }else if(gestureState.moveY < 120){
                    Animated.spring(this.animation.y, {
                        toValue: 0,
                        tension:1
                    }).start()
                }
                else if(gestureState.dy< 0){
                    this.setState({
                        isScrollEnabled : true
                    })
                    Animated.spring(this.animation.y,{
                        toValue: -SCREEN_HEIGHT + 120,
                        tension: 1
                    }).start()
                }
                else if(gestureState.dy> 0){
                    this.setState({
                        isScrollEnabled : false
                    })
                    Animated.spring(this.animation.y,{
                        toValue: SCREEN_HEIGHT -120,
                        tension: 1
                    }).start()
                }
            }
        })
    }

    render () {
        const animatedHeight ={
            transform: this.animation.getTranslateTransform()
        }
        const animatedImageHeight = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT-160],
            outputRange: [200,32],
            extrapolate: "clamp"
        })
        const animatedSongTitleOpacity = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT-500, SCREEN_HEIGHT-160],
            outputRange: [0,0,1],
            extrapolate: "clamp"
        })
        const animatedImageMarginLeft = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT-90],
            outputRange: [SCREEN_WIDTH/2 - 100, 10],
            extrapolate: "clamp"
        })
        const animatedHeaderHeight = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT-90],
            outputRange: [SCREEN_HEIGHT/2 , 90],
            extrapolate: "clamp"
        })
        const animatedSongDetailsOpacity = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT-500, SCREEN_HEIGHT-160],
            outputRange: [1,0,0],
            extrapolate: "clamp"
        })
        const animatedBackgroundColor = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT-90],
            outputRange: ['pink','white'],
            extrapolate: "clamp"
        })

        return (
            <Animated.View style={{ flex: 1, backgroundColor: animatedBackgroundColor}}>
                <Animated.View
                    {... this.panResponder.panHandlers}
                    style={[animatedHeight, {position: 'absolute', left: 0, right: 0, zIndex: 10, backgroundColor: 'white', height: SCREEN_HEIGHT}]}>
                    <ScrollView
                        scrollEnabled ={this.state.isScrollEnabled}
                        scrollEventThrottle= {16}
                        onScroll={event=>{
                            this.scrollOffset = event.nativeEvent.contentOffset.y
                        }}>
                        <Animated.View
                            style={{height: animatedHeaderHeight, borderTopWidth: 1, borderTopColor: '#ebe5e5', flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 4, flexDirection: 'row', alignItems: 'center'}}>
                                <Animated.View style={{height: animatedImageHeight, width: animatedImageHeight, marginLeft: animatedImageMarginLeft}}>
                                    <Image style={{flex:1, width: null, height: null}}
                                           source={require('../assets/images/hearth.png')}/>
                                </Animated.View>
                                <Animated.Text style={{opacity: animatedSongTitleOpacity, fontSize: 18, paddingLeft: 10}}>Hotel California(Live)</Animated.Text>
                            </View>
                            <Animated.View style={{opacity: animatedSongTitleOpacity, flex:1, flexDirection: 'row', justifyContent: 'space-around'}}>

                                <Image style={{width: 32, height: 32, opacity: 0.6}}
                                       resizeMode={"contain"}
                                       source={require('../assets/images/pause.png')}
                                />
                                <Image style={{width: 32, height: 32, opacity: 0.6}}
                                       resizeMode={"contain"}
                                       source={require('../assets/images/play_button.png')}
                                />
                            </Animated.View>
                        </Animated.View>

                        <Animated.View style={{height: animatedHeaderHeight, opacity: animatedSongDetailsOpacity }}>
                            <View style={{flex:1, alignItems: 'center', justifyContent: 'flex-end'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 22}}>I like coookiessss 33333</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 18, color: '#fa95ed'}}>LA !</Text>
                            </View>
                            <View style={{flex:2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                <Image style={{width: 32, height: 32, opacity: 0.6}}
                                       resizeMode={"contain"}
                                       source={require('../assets/images/hearth.png')}
                                />
                                <Image style={{width: 45, height: 45, opacity: 0.6}}
                                       resizeMode={"contain"}
                                       source={require('../assets/images/hearth.png')}
                                />
                                <Image style={{width: 32, height: 32, opacity: 0.6}}
                                       resizeMode={"contain"}
                                       source={require('../assets/images/hearth.png')}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20}}>
                                <Image style={{width: 32, height: 32, opacity: 0.6}}
                                       resizeMode={"contain"}
                                       source={require('../assets/images/hearth.png')}
                                />
                                <Image style={{width: 32, height: 32, opacity: 0.6}}
                                       resizeMode={"contain"}
                                       source={require('../assets/images/hearth.png')}
                                />
                            </View>
                        </Animated.View>
                        <View style={{ height: 1000}}/>
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
})