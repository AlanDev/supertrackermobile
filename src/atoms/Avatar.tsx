import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

export interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  name,
  backgroundColor = COLORS.primary[200],
  textColor = COLORS.primary[600],
  style,
}) => {
  const getAvatarSize = () => {
    const sizes = {
      sm: 32,
      md: 48,
      lg: 64,
      xl: 80,
    };
    return sizes[size];
  };

  const getIconSize = () => {
    const sizes = {
      sm: 16,
      md: 24,
      lg: 32,
      xl: 36,
    };
    return sizes[size];
  };

  const getFontSize = () => {
    const sizes = {
      sm: SIZES.font.sm,
      md: SIZES.font.base,
      lg: SIZES.font.lg,
      xl: SIZES.font.xl,
    };
    return sizes[size];
  };

  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarSize = getAvatarSize();

  const avatarStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize: getFontSize(),
    fontWeight: '600',
    color: textColor,
  };

  return (
    <View style={avatarStyle}>
      {name ? (
        <Text style={textStyle}>
          {getInitials(name)}
        </Text>
      ) : (
        <Ionicons 
          name="person" 
          size={getIconSize()} 
          color={textColor} 
        />
      )}
    </View>
  );
};

export default Avatar; 