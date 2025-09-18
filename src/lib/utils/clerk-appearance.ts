import { dark } from "@clerk/themes";

export function getClerkAppearance(isDark?: boolean) {
  return {
    baseTheme: isDark ? dark : undefined,
    elements: {
      formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
      card: "bg-background border border-border shadow-lg",
      headerTitle: "text-xl font-bold",
      headerSubtitle: "text-muted-foreground",
      socialButtonsBlockButton: "bg-muted hover:bg-muted/80",
      // Inputs
      formFieldInput: "bg-background border border-input text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary",
      formFieldLabel: "text-sm font-medium text-foreground",
      // Links & footer
      footerActionLink: "text-primary hover:text-primary/90",
      // User/Profile popovers
      userButtonPopoverCard: "bg-background border border-border shadow",
      userPreviewMainIdentifier: "text-foreground",
      userPreviewSecondaryIdentifier: "text-muted-foreground",
      userButtonPopoverActionButton: "hover:bg-muted",
      // Organization components
      organizationSwitcherTrigger: "hover:bg-muted",
      organizationProfileSectionTitle__danger: "text-red-500",
    },
  } as const;
}
