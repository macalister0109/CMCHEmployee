import { View, TextInput, Alert, TouchableOpacity, Text } from "react-native";
import { useState, useEffect } from "react";
import { THEME_ESTUDENT } from "../../constants";

interface CreateProfileFormInfo {
    name: string;
    about: string;
}

export default function CreateProfileForm() {
    const [credentials, setCredentials] = useState<CreateProfileFormInfo>({
        name: "",
        about: "",
    });

    const handleInputChange = (
        field: keyof CreateProfileFormInfo,
        value: string
    ) => {
        setCredentials((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return <View></View>;
}
