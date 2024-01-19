import React, { useState } from 'react';
import {
    TouchableOpacity,
    Text,
    TextInput,
    View,
    StyleSheet,
    Alert,
    Image,
    useColorScheme,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import {
    getAuth,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from '../firebase/firebaseConfig';

import { colors } from '../colors/colors';

const auth = getAuth();

const registerAccount = (email, password, setCurrentScreen) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            // Signed up
            console.log('registered ' + email);
            const user = userCredential.user.email;
            console.log('registered ' + user);
            setCurrentScreen('Main');
        })
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert('Error Registering', errorMessage, [
                {
                    text: 'OK',
                },
            ]);
            console.log('error register ' + errorCode + ' ' + errorMessage);
            // ..
        });
};

const loginWithAccount = (email, password, setCurrentScreen) => {
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            // Signed in
            const user = userCredential.user.email;
            console.log('logged in ' + user);
            setCurrentScreen('Main');
        })
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert('Error Logging In', errorMessage, [
                {
                    text: 'OK',
                },
            ]);
            console.log('error login ' + errorCode + ' ' + errorMessage);
        });
};

const Login = ({ setCurrentScreen }) => {
    const [hasAccount, setHasAccount] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const theme = useColorScheme();


    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleForgotPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Password reset email sent');
                Alert.alert(
                    'Password reset email sent to ' + email,
                    "If you don't see it, check your junk folder.",
                    [
                        {
                            text: 'OK',
                        },
                    ]
                );
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('error password reset ' + errorCode + ' ' + errorMessage);
            });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.borderContainer]}>

                    <Text style={[styles.signupLoginText, theme == 'light' ? styles.signupLoginTextLight : styles.signupLoginTextDark]}>
                        {hasAccount ? 'LOGIN' : 'SIGN UP'}
                    </Text>
                    <Text style={[theme == "light" ? styles.lightTheme : styles.darkTheme]}>
                        {'\n'}
                        Email
                    </Text>
                    <View style={styles.inputView} borderColor={theme == "light" ? colors.defaultButtonColor : "white"}>
                        <TextInput
                            style={[styles.textInput, theme == "light" ? styles.lightTheme : styles.darkTheme]}
                            onChangeText={email => setEmail(email)} />
                    </View>

                    <Text style={[theme == "light" ? styles.lightTheme : styles.darkTheme,]}>
                        Password
                    </Text>
                    <View style={styles.inputView} borderColor={theme == "light" ? colors.defaultButtonColor : "white"}>
                        <TextInput
                            secureTextEntry={!showPassword}
                            style={[styles.textInput, theme == "light" ? styles.lightTheme : styles.darkTheme]}
                            onChangeText={password => setPassword(password)} />

                        <TouchableOpacity onPress={toggleShowPassword} style={styles.showPasswordBtn}>
                            <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} style={theme == "light" ? styles.lightTheme : styles.darkTheme} />
                        </TouchableOpacity>

                        {hasAccount &&
                            <TouchableOpacity onPress={toggleForgotPassword} style={styles.forgotBtnContainer}>
                                <Text style={[styles.forgotBtn, theme == "light" ? styles.lightTheme : styles.darkTheme]}>


                                    forgot password?</Text>
                            </TouchableOpacity>}
                    </View>

                    <TouchableOpacity style={[styles.loginBtnContainer, theme == "light" ? styles.loginBtnContainerLight : styles.loginBtnContainerDark]} onPress={() => { hasAccount ? loginWithAccount(email, password, setCurrentScreen) : registerAccount(email, password, setCurrentScreen); }}>
                        <Text style={[styles.loginBtnText, theme == "light" ? styles.loginBtnTextLight : styles.loginBtnTextDark]}>
                            {hasAccount ? 'Login' : 'Register'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.sep} />

                    <TouchableOpacity style={styles.userBtnContainer} onPress={() => { setHasAccount(!hasAccount); }}>
                        <Text style={[styles.userBtnText, theme == "light" ? styles.lightTheme : styles.darkTheme]}>
                            {hasAccount ? 'Need an account? SIGN UP' : 'Already a User? LOGIN'}
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        width: 330,
        marginBottom: 100,
    },
    borderContainer: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 40,
    },
    sep: {
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    inputView: {
        borderRadius: 4,
        borderWidth: 2,
        height: 40,
        marginBottom: 20,
        marginTop: 5,
    },
    textInput: {
        padding: 10,
        width: 185,
    },
    signupLoginText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    forgotBtnContainer: {
        marginLeft: 101,
        marginTop: 10,
        width: 104,
    },
    forgotBtn: {
        textAlign: 'right',
        fontSize: 13,
    },
    showPasswordBtn: {
        position: 'absolute',
        right: 5,
        top: 7,
    },
    loginBtnContainer: {
        borderRadius: 4,
        borderWidth: 2,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25,
        marginTop: 12,
    },
    loginBtnText: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    userBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    userBtnText: {
        color: 'black',
        textAlign: 'center',
    },
    loginBtnContainerLight: {
        borderColor: colors.lightLoginButtonColor,
        backgroundColor: colors.lightLoginButtonColor,
    },
    loginBtnTextLight: {
        backgroundColor: colors.lightLoginButtonColor,
    },
    signupLoginTextLight: {
        color: colors.lightLoginButtonColor,
    },
    lightTheme: {
        backgroundColor: 'white',
    },
    darkTheme: {
        backgroundColor: '#212020',
        color: colors.appBackgroundColor,
    },
    loginBtnContainerDark: {
        borderColor: colors.darkLoginButtonColor,
        backgroundColor: colors.darkLoginButtonColor,
    },
    loginBtnTextDark: {
        backgroundColor: colors.darkLoginButtonColor,
    },
    signupLoginTextDark: {
        color: colors.darkLoginButtonColor,
    },
});

export default Login;
