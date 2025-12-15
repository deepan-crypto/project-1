import { View, Image, StyleSheet } from 'react-native';

export default function LogoHeader() {
    return (
        <View style={styles.header}>
            <Image
                source={require('../../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingBottom: 16,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 50,
        height: 50,
    },
});
