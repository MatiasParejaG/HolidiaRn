import { useEffect, useMemo, useState } from 'react';
import { ImageColorsResult, getColors } from 'react-native-image-colors';
import { PRIMARY } from '../theme/colors';

export const useImageColors = (imageUrl: string) => {
  const [colors, setColors] = useState<ImageColorsResult>();

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await getColors(imageUrl);
        setColors(response);
      } catch (e) {
        console.log(e);
      }
    };
    fetchColors();
  }, [imageUrl]);

  const colorPalette = useMemo(() => {
    if (!colors) {
      return {
        primary: PRIMARY,
        secondary: PRIMARY,
        background: PRIMARY,
      };
    }

    if ('platform' in colors) {
      if (colors.platform === 'ios') {
        return {
          primary: colors.primary,
          secondary: colors.secondary,
          background: colors.background,
        };
      }
      if (colors.platform === 'android') {
        return {
          primary: colors.dominant,
          secondary: colors.dominant,
          background: colors.dominant,
        };
      }
    }
  }, [colors]);

  return {
    colors: colorPalette,
  };
};
