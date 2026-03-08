import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  size?: "md" | "sm" | "icon";
};

export const Button: React.FC<Props> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}) => {
  const classes = [
    "btn",
    variant === "primary" ? "btn-primary" : "btn-ghost",
    size === "sm" ? "btn-sm" : "",
    size === "icon" ? "btn-icon" : "",
    className ?? ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

