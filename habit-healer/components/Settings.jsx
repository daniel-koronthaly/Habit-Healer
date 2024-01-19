import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { signOut, getAuth, getDatabase, deleteUser, remove, ref, child } from "../firebase/firebaseConfig";

import { colors } from '../colors/colors'

const auth = getAuth();

export default function Settings({setCurrentScreen}) {
    const theme = useColorScheme();
    const uid = auth.currentUser.uid;
    
    const deleteAccount = () => {
        Alert.alert(
            "Do you want to delete this account?",
            "You cannot undo this action.",
            [
                {
                    text: "Cancel",
                },
                {
                    text: "Delete",
                    onPress: () => {
                        const user = auth.currentUser;
                        const dbRef = ref(getDatabase());
                        remove(child(dbRef, "users/" + user.uid)).catch((error) => {
                            console.log("Error deleting firebase entry" + error)
                        });
                        deleteUser(user).then(() => {
                            console.log("User deleted")
                        }).catch((error) => {
                            console.log("Error deleting user " + error)
                        });
                        setCurrentScreen('Login');
                    },
                    style: 'destructive'
                },
            ]
        );

    }

    const signOutUser = () => {
        Alert.alert(
            "Do you want to log out?",
            "You can always log back in.",
            [
                {
                    text: "Cancel",
                },
                {
                    text: "Sign out",
                    onPress: () => {
                        const auth = getAuth();
                        signOut(auth).then(() => {
                            console.log("User logged out")
                        }).catch((error) => {
                            console.log(error);
                        })
                        setCurrentScreen('Login');
                    },
                },
            ]
        );

    }

    return (
        <View style={styles.container}>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={[styles.signOutBtn, styles.btn]} onPress={() => { signOutUser() }}>
                    <Text style={styles.btnTxt}>Sign Out</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.deleteBtn, styles.btn]} onPress={() => { deleteAccount() }}>
                    <Text style={styles.btnTxt}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 10,
        flex: 1,
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 40
    },
    btn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    deleteBtn: {
        backgroundColor: colors.defaultButtonColor,
    },
    signOutBtn: {
        backgroundColor: colors.defaultButtonColor,
        marginBottom: 20,
    },
    btnTxt: {
        color: 'white',
        fontWeight: 'bold',
    },
});