import { Image, View, Text } from "react-native";
import { styles } from "./styles";
interface Props {
    image_profile: any;
    image_banner: any;
}

export default function PorfileImages({ image_banner, image_profile }: Props) {
    return (
        <View style={styles.container}>
            <Image source={image_banner} style={styles.imgBanner}></Image>
            <View style={styles.imgProfileContainer}>
                <Image source={image_profile} style={styles.imgProfile}></Image>
            </View>
        </View>
    );
}
