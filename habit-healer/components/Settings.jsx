import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import MainpageHeader from './MainpageHeader';
import { signOut, auth, getDatabase, deleteUser, remove, ref, child } from "../firebase/firebaseConfig";
import { colors } from '../colors/colors'

export default function Settings({ setCurrentScreen }) {
    const theme = useColorScheme();
    const uid = auth.currentUser.uid;
    const email = auth.currentUser.email;

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
        <View>
            <>
                <MainpageHeader
                    title={"Settings"}
                    rightSideButtonArray={
                        [
                        ]
                    }
                />
            </>
            <View>
                <Text style={styles.loggedInText}>Currently logged in as:</Text>
                <Text style={styles.username}>{email}</Text>
            </View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        padding: 10,
        width: Dimensions.get('window').width
    },
    btnContainer: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 40,
    },
    btn: {
        backgroundColor: colors.darkLoginButtonColor,
        marginBottom: 10,
        height: 70,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    btnTxt: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },

    deleteBtn: {
        backgroundColor: colors.defaultButtonColor,
    },
    signOutBtn: {
        backgroundColor: colors.defaultButtonColor,
        marginBottom: 20,
    },
    username: {
        fontSize: 23,
        fontWeight: 'bold',
        color: colors.appBackgroundColor,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 10,
        
    },
    loggedInText: {
        fontSize: 23,
        color: colors.appBackgroundColor,
        textAlign: 'center',
    },
});