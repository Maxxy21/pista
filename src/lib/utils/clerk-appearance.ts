import { dark } from "@clerk/themes";

export function getClerkAppearance() {
  return {
    baseTheme: dark,
    elements: {
      card: "bg-[#171512] border border-[rgba(242,234,211,0.12)] shadow-none rounded-2xl",
      headerTitle: "text-[#F2EAD3] font-semibold",
      headerSubtitle: "text-[rgba(242,234,211,0.55)]",
      formButtonPrimary:
        "bg-[#F2EAD3] text-[#0e0d0c] hover:opacity-85 rounded-full font-medium shadow-none",
      socialButtonsBlockButton:
        "border border-[rgba(242,234,211,0.12)] bg-[rgba(242,234,211,0.05)] text-[#F2EAD3] hover:bg-[rgba(242,234,211,0.08)] rounded-xl",
      socialButtonsBlockButtonText: "text-[#F2EAD3]",
      formFieldInput:
        "bg-[rgba(242,234,211,0.05)] border border-[rgba(242,234,211,0.12)] text-[#F2EAD3] placeholder:text-[rgba(242,234,211,0.3)] rounded-xl focus:ring-1 focus:ring-[rgba(242,234,211,0.3)]",
      formFieldLabel: "text-[rgba(242,234,211,0.7)] text-sm font-medium",
      footerActionLink: "text-[#F2EAD3] hover:opacity-80",
      footerActionText: "text-[rgba(242,234,211,0.45)]",
      dividerLine: "bg-[rgba(242,234,211,0.1)]",
      dividerText: "text-[rgba(242,234,211,0.35)]",
      identityPreviewText: "text-[#F2EAD3]",
      identityPreviewEditButton: "text-[rgba(242,234,211,0.6)]",
      formResendCodeLink: "text-[#F2EAD3]",
      userButtonPopoverCard: "bg-[#171512] border border-[rgba(242,234,211,0.12)]",
      userPreviewMainIdentifier: "text-[#F2EAD3]",
      userPreviewSecondaryIdentifier: "text-[rgba(242,234,211,0.55)]",
      userButtonPopoverActionButton: "hover:bg-[rgba(242,234,211,0.05)] text-[#F2EAD3]",
      organizationSwitcherTrigger: "hover:bg-[rgba(242,234,211,0.05)]",
    },
  } as const;
}
