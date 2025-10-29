import { Text, View } from "react-native";
import PorfileImages from "./ProfileImages";
import { profileData } from "../../types/profileData";
import { styles } from "./styles";

interface Props {
    data: profileData;
    img: [any, any];
}

export default function ProfileInformation({ data, img }: Props) {
    return (
        <View>
            <PorfileImages image_profile={img[0]} image_banner={img[1]} />
            <View style={styles.infoContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{data.name}</Text>
                    <Text style={styles.subName}>{data.subName}</Text>
                </View>
                <View style={styles.aboutMeContainer}>
                    <Text style={styles.title}>Acerca de</Text>
                    <View style={styles.line}></View>
                    <Text style={styles.description}>{data.aboutMe}</Text>
                </View>
            </View>
        </View>
    );
}
