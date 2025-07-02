import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SIZES } from '../constants';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  color?: string;
  style?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  color = COLORS.primary[600],
  style,
}) => {
  const titleSizes = {
    sm: { fontSize: SIZES.font.lg },
    md: { fontSize: SIZES.font.title },
    lg: { fontSize: SIZES.font.display },
  };

  const taglineSizes = {
    sm: { fontSize: SIZES.font.xs },
    md: { fontSize: SIZES.font.sm },
    lg: { fontSize: SIZES.font.base },
  };

  const titleStyle: TextStyle = {
    ...titleSizes[size],
    fontWeight: 'bold',
    color,
    textAlign: 'center',
  };

  const taglineStyle: TextStyle = {
    ...taglineSizes[size],
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  };

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <Text style={titleStyle}>
        SuperTracker
      </Text>
      
      {showTagline && (
        <Text style={taglineStyle}>
          Tu comparador de precios
        </Text>
      )}
    </View>
  );
};

export default Logo;
