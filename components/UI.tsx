// Professional UI Components for Stryde SG

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Typography, Shadows, Gradients, Icons } from '../constants/theme';

// Gradient Card Component
export function GradientCard({
  children,
  gradient = 'card',
  style,
  onPress,
}: {
  children: React.ReactNode;
  gradient?: keyof typeof Gradients;
  style?: ViewStyle;
  onPress?: () => void;
}) {
  const gradientConfig = Gradients[gradient];
  const content = (
    <LinearGradient
      colors={gradientConfig.colors}
      start={gradientConfig.start}
      end={gradientConfig.end}
      style={[styles.gradientCard, style]}
    >
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.9}>{content}</TouchableOpacity>;
  }
  return content;
}

// Modern Card Component
export function Card({
  children,
  variant = 'default',
  style,
  onPress,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'flat';
  style?: ViewStyle;
  onPress?: () => void;
}) {
  const cardStyle = variant === 'elevated' ? styles.cardElevated : variant === 'flat' ? styles.cardFlat : styles.card;

  const content = <View style={[cardStyle, style]}>{children}</View>;

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.8}>{content}</TouchableOpacity>;
  }
  return content;
}

// Gradient Button Component
export function GradientButton({
  title,
  onPress,
  gradient = 'primary',
  style,
  textStyle,
  icon,
  loading = false,
  disabled = false,
  small = false,
}: {
  title: string;
  onPress: () => void;
  gradient?: keyof typeof Gradients;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
}) {
  const gradientConfig = Gradients[gradient];
  const buttonStyle = small ? styles.buttonSmall : styles.button;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[buttonStyle, style, (disabled || loading) && styles.buttonDisabled]}
    >
      <LinearGradient
        colors={disabled || loading ? [Colors.gray300, Colors.gray400] : gradientConfig.colors}
        start={gradientConfig.start}
        end={gradientConfig.end}
        style={styles.buttonGradient}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <View style={styles.buttonContent}>
            {icon && <Text style={[styles.buttonIcon, small && styles.buttonIconSmall]}>{icon}</Text>}
            <Text style={[styles.buttonText, small && styles.buttonTextSmall, textStyle]}>{title}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// Outline Button Component
export function OutlineButton({
  title,
  onPress,
  style,
  textStyle,
  icon,
  color = Colors.primary,
  small = false,
}: {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  color?: string;
  small?: boolean;
}) {
  const buttonStyle = small ? styles.outlineButtonSmall : styles.outlineButton;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[buttonStyle, { borderColor: color }, style]}
    >
      <View style={styles.buttonContent}>
        {icon && <Text style={[styles.outlineButtonIcon, small && styles.outlineButtonIconSmall, { color }]}>{icon}</Text>}
        <Text style={[styles.outlineButtonText, small && styles.outlineButtonTextSmall, { color }, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Badge Component
export function Badge({
  text,
  variant = 'primary',
  size = 'md',
  style,
}: {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}) {
  const badgeColor = {
    primary: Colors.primary,
    secondary: Colors.secondary,
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    info: Colors.info,
  }[variant];

  const badgeSize = {
    sm: styles.badgeSm,
    md: styles.badgeMd,
    lg: styles.badgeLg,
  }[size];

  return (
    <View style={[styles.badge, badgeSize, { backgroundColor: badgeColor + '20', borderColor: badgeColor }, style]}>
      <Text style={[styles.badgeText, { color: badgeColor }]}>{text}</Text>
    </View>
  );
}

// Section Header Component
export function SectionHeader({
  title,
  subtitle,
  icon,
  action,
  actionText,
  style,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: () => void;
  actionText?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <View style={styles.sectionHeaderLeft}>
        {icon && <Text style={styles.sectionHeaderIcon}>{icon}</Text>}
        <View>
          <Text style={styles.sectionHeaderTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionHeaderSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {action && actionText && (
        <TouchableOpacity onPress={action} activeOpacity={0.7}>
          <Text style={styles.sectionHeaderAction}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Stat Card Component
export function StatCard({
  icon,
  label,
  value,
  change,
  changeType,
  gradient = 'primary',
  onPress,
}: {
  icon: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  gradient?: keyof typeof Gradients;
  onPress?: () => void;
}) {
  const changeColor = changeType === 'positive' ? Colors.success : changeType === 'negative' ? Colors.error : Colors.gray500;

  return (
    <GradientCard gradient={gradient} style={styles.statCard} onPress={onPress}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {change && (
        <Text style={[styles.statChange, { color: changeColor }]}>
          {changeType === 'positive' && Icons.arrowUp}
          {changeType === 'negative' && Icons.arrowDown}
          {change}
        </Text>
      )}
    </GradientCard>
  );
}

// Progress Bar Component
export function ProgressBar({
  progress,
  height = 8,
  color = Colors.primary,
  backgroundColor = Colors.gray200,
  style,
  showLabel = false,
  label,
}: {
  progress: number; // 0 to 1
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  showLabel?: boolean;
  label?: string;
}) {
  const percentage = Math.round(progress * 100);

  return (
    <View style={style}>
      {showLabel && (
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressPercentage}>{percentage}%</Text>
        </View>
      )}
      <View style={[styles.progressBar, { height, backgroundColor }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(progress * 100, 100)}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

// Empty State Component
export function EmptyState({
  icon,
  title,
  message,
  action,
  actionText,
  style,
}: {
  icon: string;
  title: string;
  message: string;
  action?: () => void;
  actionText?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.emptyState, style]}>
      <Text style={styles.emptyStateIcon}>{icon}</Text>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateMessage}>{message}</Text>
      {action && actionText && (
        <GradientButton title={actionText} onPress={action} style={styles.emptyStateButton} small />
      )}
    </View>
  );
}

// Chip Component (for tags, filters, etc.)
export function Chip({
  label,
  onPress,
  selected = false,
  icon,
  onRemove,
  style,
}: {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  icon?: string;
  onRemove?: () => void;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        selected && styles.chipSelected,
        style,
      ]}
      disabled={!onPress && !onRemove}
    >
      {icon && <Text style={styles.chipIcon}>{icon}</Text>}
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.chipRemove}>×</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

// Divider Component
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  // Card Styles
  gradientCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  cardElevated: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  cardFlat: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },

  // Button Styles
  button: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  buttonSmall: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
  buttonTextSmall: {
    fontSize: Typography.sm,
  },
  buttonIcon: {
    fontSize: Typography.xl,
    marginRight: Spacing.sm,
  },
  buttonIconSmall: {
    fontSize: Typography.md,
    marginRight: Spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Outline Button Styles
  outlineButton: {
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  outlineButtonSmall: {
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  outlineButtonText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
  outlineButtonTextSmall: {
    fontSize: Typography.sm,
  },
  outlineButtonIcon: {
    fontSize: Typography.lg,
    marginRight: Spacing.sm,
  },
  outlineButtonIconSmall: {
    fontSize: Typography.md,
    marginRight: Spacing.xs,
  },

  // Badge Styles
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  badgeLg: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  badgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },

  // Section Header Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionHeaderIcon: {
    fontSize: Typography.xxl,
    marginRight: Spacing.sm,
  },
  sectionHeaderTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  sectionHeaderSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeaderAction: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },

  // Stat Card Styles
  statCard: {
    minWidth: 120,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: Typography.xxxl,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  statChange: {
    fontSize: Typography.xs,
    marginTop: Spacing.xs,
    fontWeight: Typography.semibold,
  },

  // Progress Bar Styles
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  progressLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  progressPercentage: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
  progressBar: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: BorderRadius.full,
  },

  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyStateTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: Typography.relaxed * Typography.md,
  },
  emptyStateButton: {
    marginTop: Spacing.md,
  },

  // Chip Styles
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chipSelected: {
    backgroundColor: Colors.primary + '20',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  chipIcon: {
    fontSize: Typography.sm,
    marginRight: Spacing.xs,
  },
  chipLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  chipLabelSelected: {
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
  chipRemove: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    fontWeight: Typography.bold,
  },

  // Divider Styles
  divider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: Spacing.md,
  },
});
