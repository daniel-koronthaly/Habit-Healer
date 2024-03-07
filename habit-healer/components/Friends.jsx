import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    useColorScheme
} from 'react-native'
import MainpageHeader from './MainpageHeader'
import { colors } from '../colors/colors';


const Friends = ({ setCurrentScreen }) => {

    const theme = useColorScheme();
    return (
        <View>
            <>
                <MainpageHeader
                    title={"Friends"}
                    rightSideButtonArray={
                        [
                            <TouchableOpacity onPress={() => { setCurrentScreen("FriendsOverview"); }}>
                                <Text style={[styles.topRightButtonText, { color: colors.headerColor }]}>View Friends</Text>
                            </TouchableOpacity>,
                        ]
                    }
                />
            </>
            <View style={styles.container}>
                <Text style={{color: 'white'}}>Hello</Text>
            </View>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        width: 330,
    },
    topRightButtonText: {
        fontWeight: '700',
        fontSize: 18,
        //color: 'white'
    },
    lightText: {
        color: colors.lightTextColor
    },
    darkText: {
        color: colors.darkTextColor
    }
})
export default Friends