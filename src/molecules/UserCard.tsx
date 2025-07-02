import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '../atoms/Avatar';
import { COLORS, SIZES } from '../constants';

export interface UserCardProps {
  name: string;
  email: string;
  memberSince?: string;
  avatar?: string;
  showMemberSince?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  name,
  email,
  memberSince,
  avatar,
  showMemberSince = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar 
          name={name}
          size="lg"
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>
          {name}
        </Text>
        
        <Text style={styles.emailText}>
          {email}
        </Text>
        
        {showMemberSince && memberSince && (
          <Text style={styles.memberText}>
            Miembro desde {memberSince}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius.lg,
    padding: SIZES.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    marginRight: SIZES.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: SIZES.font.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  emailText: {
    fontSize: SIZES.font.base,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  memberText: {
    fontSize: SIZES.font.xs,
    color: COLORS.text.light,
  },
});

export default UserCard; 