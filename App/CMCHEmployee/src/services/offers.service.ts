import { offerDates } from "../types/offerDates";
import offers from "../data/offers.json";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

const OFFERS_FILE = "offers.json";
const DATA_PATH = `${FileSystem.documentDirectory}${OFFERS_FILE}`;

export const OffersService = {
    async loadOffers(): Promise<offerDates[]> {
        try {
            // En desarrollo, usa el archivo json estático
            if (__DEV__ && Platform.OS === "web") {
                return offers.offers;
            }

            try {
                const fileInfo = await FileSystem.getInfoAsync(DATA_PATH);

                if (!fileInfo.exists) {
                    await this.saveOffers([]);
                    return [];
                }

                const content = await FileSystem.readAsStringAsync(DATA_PATH);
                return JSON.parse(content).offers;
            } catch (error) {
                console.error("Error reading file:", error);
                return [];
            }
        } catch (error) {
            console.error("Error loading offers:", error);
            return [];
        }
    },

    async saveOffers(offers: offerDates[]): Promise<void> {
        try {
            // En desarrollo web, solo logea
            if (__DEV__ && Platform.OS === "web") {
                console.log("Would save offers:", offers);
                return;
            }

            const content = JSON.stringify({ offers }, null, 2);
            await FileSystem.writeAsStringAsync(DATA_PATH, content);
        } catch (error) {
            console.error("Error saving offers:", error);
        }
    },

    async addOffer(offer: offerDates): Promise<void> {
        const currentOffers = await this.loadOffers();
        await this.saveOffers([offer, ...currentOffers]);
    },
};
