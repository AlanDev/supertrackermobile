import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-purple-600 border-purple-600';
      case 'secondary':
        return 'bg-gray-100 border-gray-200';
      case 'danger':
        return 'bg-red-600 border-red-600';
      case 'success':
        return 'bg-green-600 border-green-600';
      case 'outline':
        return 'bg-transparent border-purple-600 border-2';
      default:
        return 'bg-purple-600 border-purple-600';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return 'text-gray-700';
      case 'outline':
        return 'text-purple-600';
      default:
        return 'text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 rounded-lg';
      case 'lg':
        return 'px-8 py-4 rounded-xl';
      default:
        return 'px-6 py-3 rounded-xl';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  const isDisabled = disabled || loading;

  const buttonClasses = [
    'border flex-row items-center justify-center',
    getVariantStyles(),
    getSizeStyles(),
    fullWidth ? 'w-full' : '',
    isDisabled ? 'opacity-50' : '',
    className,
  ].filter(Boolean).join(' ');

  const textClasses = [
    'font-semibold text-center',
    getTextColor(),
    getTextSize(),
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={variant === 'secondary' || variant === 'outline' ? COLORS.primary[600] : 'white'}
        />
      );
    }

    if (icon) {
      return (
        <Ionicons 
          name={icon} 
          size={getIconSize()} 
          color={variant === 'secondary' || variant === 'outline' ? COLORS.primary[600] : 'white'}
        />
      );
    }

    return null;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={buttonClasses}
      style={({ pressed }) => [
        {
          opacity: pressed && !isDisabled ? 0.8 : 1,
        },
      ]}
    >
      {icon && iconPosition === 'left' && (
        <View className="mr-2">
          {renderIcon()}
        </View>
      )}
      
      {loading ? (
        <Text className={textClasses}>Cargando...</Text>
      ) : (
        <Text className={textClasses}>{title}</Text>
      )}
      
      {icon && iconPosition === 'right' && (
        <View className="ml-2">
          {renderIcon()}
        </View>
      )}
    </Pressable>
  );
};

export default Button; 