import { ESTUDENT_VIEW, COMPANY_VIEW } from "../../types/colors";
import { SIZES } from "../../types/sizes";
import { FONT_SIZES, FONT_WEIGHTS } from "../../types/typography";
import { DEVICE_HEIGHT, DEVICE_WIDTH, WIDTH } from "../../types/width";

export const THEME_ESTUDENT = {
    sizes: SIZES,
    font_sizes: FONT_SIZES,
    font_weights: FONT_WEIGHTS,
    colors: ESTUDENT_VIEW,
    width: WIDTH,
    device_width: DEVICE_WIDTH,
    device_height: DEVICE_HEIGHT,
};

export const THEME_COMPANY = {
    sizes: SIZES,
    font_sizes: FONT_SIZES,
    font_weights: FONT_WEIGHTS,
    colors: COMPANY_VIEW,
    width: WIDTH,
    device_width: DEVICE_WIDTH,
    device_height: DEVICE_HEIGHT,
};

export type AppTheme = typeof THEME_ESTUDENT;

export default THEME_ESTUDENT;
