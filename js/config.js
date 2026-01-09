export const config = {
  app_title: "UniSync",
  discover_title: "Discover",
  calendar_title: "My Calendar",
  organizations_title: "Organizations",
  background_color: "#ffffff",
  surface_color: "#f8f9fa",
  text_color: "#1a1a1a",
  primary_action: "#000000",
  secondary_action: "#6b7280",
  font_family: "Inter",
  font_size: 15
};

export function getTheme(isDarkMode) {
  return {
    backgroundColor: isDarkMode ? "#1a1a1a" : config.background_color,
    surfaceColor: isDarkMode ? "#2d2d2d" : config.surface_color,
    textColor: isDarkMode ? "#ffffff" : config.text_color,
    primaryAction: isDarkMode ? "#ffffff" : config.primary_action,
    secondaryAction: isDarkMode ? "#9ca3af" : config.secondary_action,
    baseSize: config.font_size,
    isDarkMode
  };
}