import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

export interface MenuOptionProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  iconColor?: string;
  showChevron?: boolean;
  style?: ViewStyle;
}

export const MenuOption: React.FC<MenuOptionProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  iconColor = COLORS.primary[600],
  showChevron = true,
  style,
}) => {
  return (
    <Pressable 
      style={[styles.container, style]} 
      onPress={onPress}
      android_ripple={{ color: COLORS.gray[100] }}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={SIZES.icon.md} color={iconColor} />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>
          {title}
        </Text>
        
        {subtitle && (
          <Text style={styles.subtitleText}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {showChevron && (
        <Ionicons 
          name="chevron-forward" 
          size={SIZES.icon.sm}
          color={COLORS.gray[400]} 
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing.md,
    backgroundColor: COLORS.background,
  },
  iconContainer: {
    width: SIZES.icon.lg,
    height: SIZES.icon.lg,
    marginRight: SIZES.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: SIZES.font.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: SIZES.font.sm,
    color: COLORS.text.secondary,
  },
});

export default MenuOption; 