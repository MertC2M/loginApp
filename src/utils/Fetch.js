import {Alert} from "react-native";

export function FetchPost(address, details, isSecure, callback, errorCallback) {
    let formBody = [];
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    if (isSecure) {
        formBody += "&phone=" + encodeURIComponent(global.phone) + "&password=" + encodeURIComponent(global.password);
    }

    fetch(address, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    }).then((response) => response.json())
        .then((responseJson) => {
            callback(responseJson)
        })
        .catch((error) => {
            errorCallback(error)
        });
}

export function FetchGet(address, parameters, isSecure, callback, errorCallback) {
    console.log(address+ ' ' + parameters);
    let query = [];
    for (let parameter in parameters) {
        let encodedKey = encodeURIComponent(parameter);
        let encodedValue = encodeURIComponent(parameters[parameter]);
        query.push(encodedKey + "=" + encodedValue);
    }
    query = query.join("&");
    if (isSecure) {
        query += "&nickname=" + encodeURIComponent(global.nickname) + "&password=" + encodeURIComponent(global.password);
        console.log(query + '------');
    }

    fetch(address + "?" + query, {
        method: 'GET',
    }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            callback(responseJson)
        })
        .catch((error) => {
            errorCallback(error)
        });
}

export function FetchGetWOJSON(address, parameters, isSecure, callback, errorCallback) {
    let query = [];
    for (let parameter in parameters) {
        let encodedKey = encodeURIComponent(parameter);
        let encodedValue = encodeURIComponent(parameters[parameter]);
        query.push(encodedKey + "=" + encodedValue);
    }
    query = query.join("&");
    if (isSecure) {
        query += "&phone=" + encodeURIComponent(global.phone) + "&password=" + encodeURIComponent(global.password);
    }

    fetch(address + "?" + query, {
        method: 'GET',
    }).then((response) => response)
        .then((responseJson) => {
            callback(responseJson)
        })
        .catch((error) => {
            errorCallback(error)
        });
}

export function FetchPhoto(source, callback) {
    FetchGet("https://0idl79raql.execute-api.us-west-1.amazonaws.com/api/create_presigned_url", [], true, function (responseJson) {
            let status = responseJson["status"];
            if (status === "OK") {
                let file = responseJson["file"];
                var photo_url = file.file_url
                var xhr = new XMLHttpRequest();
                xhr.open("PUT", file.url);
                xhr.setRequestHeader('Content-Type', 'image/jpeg');
                xhr.setRequestHeader("x-amz-acl", 'public-read');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200 || xhr.status === 204) {
                            callback(photo_url);
                        } else {
                            console.log(xhr.response);
                        }
                    }
                };
                xhr.send(source, {type: 'image/jpg'});
            } else if (status === "Not Authenticated"){
                Alert.alert(
                    'You are not authenticated',
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
                callback();
            }
        }.bind(this),
        function (error) {
            console.log(error);
        });
}