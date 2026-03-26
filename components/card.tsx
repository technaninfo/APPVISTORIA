import { View, ViewProps } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  className?: string;
}

export function Card({ children, variant = "default", className, ...props }: CardProps) {
  const colors = useColors();

  const getVariantStyles = () => {
    switch (variant) {
      case "elevated":
        return "bg-surface border border-border shadow-md";
      case "outlined":
        return "bg-transparent border border-border";
      default:
        return "bg-surface border border-border";
    }
  };

  return (
    <View
      className={cn("rounded-xl p-4", getVariantStyles(), className)}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
      {...props}
    >
      {children}
    </View>
  );
}
