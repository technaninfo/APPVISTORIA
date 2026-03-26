import { Pressable, Text, View, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  className,
}: ButtonProps) {
  const colors = useColors();

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          bg: colors.primary,
          text: "#FFFFFF",
          border: colors.primary,
        };
      case "secondary":
        return {
          bg: colors.surface,
          text: colors.foreground,
          border: colors.border,
        };
      case "ghost":
        return {
          bg: "transparent",
          text: colors.primary,
          border: colors.primary,
        };
      case "danger":
        return {
          bg: colors.error,
          text: "#FFFFFF",
          border: colors.error,
        };
      default:
        return {
          bg: colors.primary,
          text: "#FFFFFF",
          border: colors.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2";
      case "md":
        return "px-4 py-3";
      case "lg":
        return "px-6 py-4";
      default:
        return "px-4 py-3";
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: variantStyles.bg,
          borderColor: variantStyles.border,
          borderWidth: variant === "ghost" ? 1.5 : 0,
          opacity: pressed && !disabled ? 0.9 : disabled ? 0.5 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
      ]}
      className={cn("rounded-lg items-center justify-center flex-row gap-2", getSizeStyles(), className)}
    >
      {icon && <View>{icon}</View>}
      <Text
        style={{
          color: variantStyles.text,
          fontWeight: "600",
          fontSize: size === "sm" ? 13 : size === "lg" ? 16 : 14,
        }}
      >
        {loading ? "Carregando..." : title}
      </Text>
    </Pressable>
  );
}
