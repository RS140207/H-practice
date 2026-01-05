import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing } from '../theme/colors';

export const Button = ({ title, onPress, loading, variant = 'primary', style }) => {
    const bg = variant === 'primary' ? Colors.primary : Colors.surface;
    const textColor = Colors.white;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={loading}
            style={[styles.button, { backgroundColor: bg }, style]}
        >
            {loading ? (
                <ActivityIndicator color={Colors.white} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
    },
});
