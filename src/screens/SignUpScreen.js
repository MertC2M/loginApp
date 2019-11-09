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
import  ShuffleScreen from './ShuffleScreen';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const Users =[
    { id: "1", uri: require('../assets/images/1.jpg')},
    { id: "2", uri: require('../assets/images/2.jpg')},
    { id: "3", uri: require('../assets/images/3.jpg')},
    { id: "4", uri: require('../assets/images/4.jpg')},
]
export default class SignUpScreen extends React.Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
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
        this.spinValue = new Animated.Value(0)
        this.animatedValue = new Animated.Value(0)
        this.springValue = new Animated.Value(0.3)
        this.backgroundColorAnimated = new Animated.Value(0)
        this.position = new Animated.ValueXY()
        this.state ={
            currentIndex: 0
        }
        this.rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: ['-10deg', '0deg' , '10deg'],
            extrapolate: 'clamp'
        })
        this.rotateAndTranslate = {
            transform:[{
                rotate: this.rotate
            },
                ...this.position.getTranslateTransform()
            ]
        }

        this.likeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [0 , 0 , 1],
            extrapolate: 'clamp'
        })

        this.dislikeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [1 , 0 , 0],
            extrapolate: 'clamp'
        })

        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [1 , 0 , 1],
            extrapolate: 'clamp'
        })

        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
            outputRange: [1 , 0.8 , 1],
            extrapolate: 'clamp'
        })

    }

    componentDidMount () {
        this.spin()
        this.animate()
        this.spring()
        this.colorEffect()
    }

    componentWillMount() {
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder:(evt, gestureState) => true,
            onPanResponderMove:(evt, gestureState) => {
                this.position.setValue({x: gestureState.dx, y: gestureState.dy})
            },
            onPanResponderRelease:(evt, gestureState) => {
                if(gestureState.dx > 120){
                    Animated.spring(this.position,{
                        toValue: {x: SCREEN_WIDTH + 60, y: gestureState.dy}
                    }).start(() => {
                            this.setState({currentIndex: this.state.currentIndex +1}, ()=>{
                                this.position.setValue({ x:0, y: 0})
                            })
                        }
                    )
                }
                else if(gestureState.dx < -120){
                    Animated.spring(this.position,{
                        toValue: {x: -SCREEN_WIDTH - 60, y: gestureState.dy}
                    }).start(() => {
                            this.setState({currentIndex: this.state.currentIndex +1}, ()=>{
                                this.position.setValue({ x:0, y: 0})
                            })
                        }
                    )
                }
                else{
                    Animated.spring(this.position,{
                        toValue: {x:0, y:0},
                        friction: 4
                    }).start()
                }
            },
        })
    }

    colorEffect () {
        this.backgroundColorAnimated.setValue(0.1)
        Animated.timing(
            this.backgroundColorAnimated, {
            toValue: 150,
            duration: 2000,
            easing: Easing.inOut(Easing.linear),
        }).start(() => this.colorEffect());
    }

    spring () {
        this.springValue.setValue(0.9)
        Animated.spring(
            this.springValue,
            {
                toValue: 1,
                friction: 1
            }
        ).start(() => this.spring())
    }

    animate () {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.animate())
    }

    spin () {
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear
            }
        ).start(() => this.spin())
    }

    renderUsers = () => {
        return Users.map((item,i) =>{

            if ( i < this.state.currentIndex){
                return null
            }else if ( i == this.state.currentIndex){
                return(
                    <Animated.View
                        {...this.PanResponder.panHandlers}
                        key={item.id} style={[this.rotateAndTranslate, {height: SCREEN_HEIGHT-400, width:SCREEN_WIDTH, padding: 20, position: 'absolute'}]}>
                        <Animated.View style={{opacity: this.likeOpacity, transform: [{rotate: '-30deg'}], position: 'absolute', top: 10, left: 40, zIndex: 1000}}>
                            <Text style={{borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10}}>LIKE</Text>
                        </Animated.View>

                        <Animated.View style={{opacity: this.dislikeOpacity, transform: [{rotate: '30deg'}], position: 'absolute', top: 10, right: 40, zIndex: 1000}}>
                            <Text style={{borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10}}>NOPE</Text>
                        </Animated.View>

                        <Image
                            style={{flex: 1, height: null, width: null, resizeMode: 'stretch',borderRadius: 20}}
                            source={item.uri} />
                    </Animated.View>
                )}
            else {
                return(
                    <Animated.View
                        key={item.id} style={[{opacity: this.nextCardOpacity, transform: [{scale: this.nextCardScale}], height: SCREEN_HEIGHT-400, width:SCREEN_WIDTH, padding: 20, position: 'absolute'}]}>
                        <Image
                            style={{flex: 1, height: null, width: null, resizeMode: 'stretch', borderRadius: 20}}
                            source={item.uri} />
                    </Animated.View>
                )}
        }).reverse()
    }


    render () {
        const interpolateColor = this.backgroundColorAnimated.interpolate({
            inputRange: [40, 100, 200],
            outputRange: ['rgb(10, 10, 0)', 'rgb(225, 200, 22)', 'rgb(10, 10, 0)']
        })
        const animatedStyle = {
            backgroundColor: interpolateColor
        }
        const spin = this.spinValue.interpolate({
            inputRange: [0, 0.4],
            outputRange: ['0deg', '360deg']
        })
        const marginLeft = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 300]
        })
        const marginCloud = this.animatedValue.interpolate({
            inputRange: [0, 0.1],
            outputRange: [0, 200]
        })
        return (
            <Animated.View style={[styles.container,
                //animatedStyle
            ]}>
                <Animated.View style={marginCloud}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}>
                        <Animated.Image
                            style={{
                                width: 74,
                                height: 30,
                                resizeMode: 'stretch',
                                marginTop: 15,
                                transform: [{scale: this.springValue}],
                            }}
                            source={require('../assets/images/cloud.png')}
                        />

                        <Animated.Image
                            style={{
                                width: 96,
                                height: 60,
                                resizeMode: 'stretch',
                                marginLeft: -20,
                                transform: [{scale: this.springValue}],
                            }}
                            source={require('../assets/images/cloud.png')}
                        />
                        <Animated.Image
                            style={{
                                width: 68,
                                height: 32,
                                resizeMode: 'stretch',
                                transform: [{scale: this.springValue}],
                            }}
                            source={require('../assets/images/cloud.png')}
                        />
                        <Animated.Image
                            style={{
                                width: 46,
                                height: 22,
                                resizeMode: 'stretch',
                                marginLeft: -24,
                                transform: [{scale: this.springValue}],
                            }}
                            source={require('../assets/images/cloud.png')}
                        />
                        <Animated.Image
                            style={{
                                width: 74,
                                height: 62,
                                resizeMode: 'stretch',
                                transform: [{scale: this.springValue}],
                            }}
                            source={require('../assets/images/sun.png')}
                        />

                        <Animated.Image
                            style={{
                                width: 74,
                                height: 62,
                                resizeMode: 'stretch',
                                transform: [{scale: this.springValue}],
                            }}
                            source={require('../assets/images/cloud.png')}
                        />

                    </View>
                </Animated.View>
                <Animated.View style={{
                    marginLeft}}>
                    <Animated.View style={styles.layerFirst}>
                        <Animated.Image
                            style={{
                            width: 120,
                            height: 60,
                            resizeMode: 'stretch'}}
                            source={require('../assets/images/car_body.png')}
                        />
                    </Animated.View>

                    <View style={styles.layerSecond}>
                        <View style={{marginRight: 48}}>
                            <Animated.Image
                                style={{
                                    width: 24,
                                    height: 24,
                                    resizeMode: 'stretch',
                                    transform: [{rotate: spin}] }}
                                source={require('../assets/images/wheel.png')}
                            />
                        </View>
                        <View style={{marginLeft: 0}}>
                            <Animated.Image
                                style={{
                                    width: 24,
                                    height: 24,
                                    transform: [{rotate: spin}] }}
                                source={require('../assets/images/wheel.png')}
                            />
                        </View>
                    </View>
                </Animated.View>

                <View style={{flex:1}}>
                    {this.renderUsers()}
                </View>

                <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                                <Image style={{width: 50, height: 50, opacity: 0.6}}
                                       resizeMode={"contain"}
                                       source={require('../assets/images/cross.png')}
                                />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <Image style={{width: 50, height: 50, opacity: 0.6}}
                               resizeMode={"contain"}
                               source={require('../assets/images/profile.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                        <Image style={{width: 50, height: 50, opacity: 0.6}}
                               resizeMode={"contain"}
                               source={require('../assets/images/hearth.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}} onPress={() => this.props.navigation.navigate('ShuffleScreen', {nickname: 'Mert'})}>
                        <Text>Second Animation</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }
/*
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Button
                    title="Go to two"
                    onPress={() => this.props.navigation.navigate('ShuffleScreen', {nickname: 'Mert'})}
                />
            </View>
        );
    }
 */
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    layerFirst: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    layerSecond: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -29,
    },
})
