import { dark } from "@clerk/themes";

// Warm-editorial palette (matches the design tokens in globals.css).
const INK = "#0e0d0c";
const SURFACE = "#171512";
const CREAM = "#F2EAD3";
const GOLD = "#C9A227";
const OLIVE = "#9CB24A";
const RUST = "#C2602F";

export function getClerkAppearance() {
  return {
    baseTheme: dark,
    // `variables` retint EVERY Clerk surface in one shot — account settings
    // (UserProfile), the UserButton popover, OrganizationProfile, etc. — not
    // just the parts hand-styled in `elements` below.
    variables: {
      colorPrimary: GOLD,
      colorBackground: SURFACE,
      colorText: CREAM,
      colorTextSecondary: "rgba(242,234,211,0.55)",
      colorTextOnPrimaryBackground: INK,
      colorInputBackground: "rgba(242,234,211,0.05)",
      colorInputText: CREAM,
      colorDanger: RUST,
      colorSuccess: OLIVE,
      colorWarning: GOLD,
      colorNeutral: CREAM,
      colorShimmer: "rgba(242,234,211,0.1)",
      fontFamily: "var(--font-hanken), system-ui, sans-serif",
      borderRadius: "0.65rem",
    },
    elements: {
      card: "bg-[#171512] border border-[rgba(242,234,211,0.12)] shadow-none rounded-2xl",
      headerTitle: "text-[#F2EAD3] font-semibold",
      headerSubtitle: "text-[rgba(242,234,211,0.55)]",
      formButtonPrimary:
        "bg-[#C9A227] text-[#0e0d0c] hover:opacity-90 rounded-xl font-semibold shadow-none",
      socialButtonsBlockButton:
        "border border-[rgba(242,234,211,0.12)] bg-[rgba(242,234,211,0.05)] text-[#F2EAD3] hover:bg-[rgba(242,234,211,0.08)] rounded-xl",
      socialButtonsBlockButtonText: "text-[#F2EAD3]",
      formFieldInput:
        "bg-[rgba(242,234,211,0.05)] border border-[rgba(242,234,211,0.12)] text-[#F2EAD3] placeholder:text-[rgba(242,234,211,0.3)] rounded-xl focus:ring-1 focus:ring-[#C9A227]",
      formFieldLabel: "text-[rgba(242,234,211,0.7)] text-sm font-medium",
      footerActionLink: "text-[#C9A227] hover:opacity-80",
      footerActionText: "text-[rgba(242,234,211,0.45)]",
      dividerLine: "bg-[rgba(242,234,211,0.1)]",
      dividerText: "text-[rgba(242,234,211,0.35)]",
      identityPreviewText: "text-[#F2EAD3]",
      identityPreviewEditButton: "text-[rgba(242,234,211,0.6)]",
      formResendCodeLink: "text-[#C9A227]",

      // Account settings (UserProfile) + OrganizationProfile chrome
      navbar: "bg-transparent border-r border-[rgba(242,234,211,0.1)]",
      navbarButton: "text-[rgba(242,234,211,0.7)] hover:bg-[rgba(242,234,211,0.05)]",
      navbarMobileMenuButton: "text-[#F2EAD3]",
      pageScrollBox: "bg-[#171512]",
      page: "bg-[#171512]",
      profileSectionTitleText: "text-[#F2EAD3]",
      profileSectionPrimaryButton: "text-[#C9A227] hover:bg-[rgba(242,234,211,0.05)]",
      accordionTriggerButton: "text-[#F2EAD3] hover:bg-[rgba(242,234,211,0.05)]",
      formButtonReset: "text-[rgba(242,234,211,0.6)] hover:bg-[rgba(242,234,211,0.05)]",
      badge: "bg-[rgba(201,162,39,0.15)] text-[#C9A227]",
      menuButton: "text-[#F2EAD3] hover:bg-[rgba(242,234,211,0.05)]",
      menuList: "bg-[#171512] border border-[rgba(242,234,211,0.12)]",
      menuItem: "text-[#F2EAD3] hover:bg-[rgba(242,234,211,0.05)]",

      // UserButton popover + organization switcher
      userButtonPopoverCard: "bg-[#171512] border border-[rgba(242,234,211,0.12)]",
      userPreviewMainIdentifier: "text-[#F2EAD3]",
      userPreviewSecondaryIdentifier: "text-[rgba(242,234,211,0.55)]",
      userButtonPopoverActionButton: "hover:bg-[rgba(242,234,211,0.05)] text-[#F2EAD3]",
      organizationSwitcherTrigger: "hover:bg-[rgba(242,234,211,0.05)]",
      organizationPreviewMainIdentifier: "text-[#F2EAD3]",
      organizationSwitcherPopoverCard: "bg-[#171512] border border-[rgba(242,234,211,0.12)]",
    },
  } as const;
}
