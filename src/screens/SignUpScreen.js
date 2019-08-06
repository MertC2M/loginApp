import React, {Component} from 'react';
import { Button, Text, View } from 'react-native';


export default class SignUpScreen extends React.Component {
    static navigationOptions = {
        headerTitle: 'First screen',
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    borderWidth: 25,
                    borderColor: 'teal',
                }}>
                <Button
                    title="Go to two"
                    onPress={() => this.props.navigation.navigate('SignUp')}
                />
            </View>
        );
    }
}