import React, {Component} from 'react';
import { Button, Text, View } from 'react-native';


export default class ShuffleScreen extends React.Component {
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
                    borderColor: 'teal',
                }}>
                <Button
                    title="Go to three"
                    onPress={() => this.props.navigation.navigate('RouteNameTwo')}
                />
            </View>
        );
    }
}