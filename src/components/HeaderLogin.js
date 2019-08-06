import React from 'react';
import {Text, StyleSheet, ImageBackground} from 'react-native';


const HeaderLogin = () => (
    <ImageBackground
        accessibilityRole={'image'}
        source={require('../assets/images/C2M.png')}
        style={styles.background}
        imageStyle={styles.logo}>
        <Text style={styles.text}>Welcome to C2M</Text>
    </ImageBackground>
);

const styles = StyleSheet.create({
    background: {
        paddingBottom: 200,
        paddingTop: 100,
        paddingHorizontal: 32,
        backgroundColor: '#F5FCFF',
    },
    logo: {
        opacity: 0.9,
        overflow: 'visible',
        resizeMode: 'cover',
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 0,
    },
    text: {
        fontSize: 40,
        fontWeight: '600',
        textAlign: 'center',
        color: '#000',
        shadowOpacity: 0.1,
    },
});

export default HeaderLogin;