import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ label, variant = "default", size = "sm", className }: BadgeProps) {
  const colors = useColors();

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "warning":
        return { bg: "#FEF3C7", text: "#92400E" };
      case "error":
        return { bg: "#FEE2E2", text: "#7F1D1D" };
      case "info":
        return { bg: "#DBEAFE", text: "#1E40AF" };
      default:
        return { bg: colors.border, text: colors.foreground };
    }
  };

  const styles = getVariantStyles();
  const padding = size === "sm" ? "px-2 py-1" : "px-3 py-1.5";
  const fontSize = size === "sm" ? 11 : 12;

  return (
    <View
      className={cn("rounded-full items-center justify-center", padding, className)}
      style={{ backgroundColor: styles.bg }}
    >
      <Text style={{ color: styles.text, fontSize, fontWeight: "600" }}>
        {label}
      </Text>
    </View>
  );
}
