/**
 * CivicAssist Design System
 * Inspired by modern government portal UX (hellogov style)
 * 
 * Design Principles:
 * - Clean, professional, trustworthy
 * - High accessibility and readability
 * - Clear information hierarchy
 * - Consistent spacing and typography
 * - Mobile-first responsive design
 */

export const theme = {
  // ===== COLOR PALETTE =====
  colors: {
    // Primary - Teal/Cyan (Government portal blue-green)
    primary: {
      50: '#E6F7F6',
      100: '#CCEFED',
      200: '#99DFDB',
      300: '#66CFC9',
      400: '#33BFB7',
      500: '#00A9A0', // Main primary color
      600: '#008780',
      700: '#006560',
      800: '#004340',
      900: '#002120',
    },

    // Secondary - Purple accent
    secondary: {
      50: '#F3F0FF',
      100: '#E7E1FF',
      200: '#CFC3FF',
      300: '#B7A5FF',
      400: '#9F87FF',
      500: '#8769FF',
      600: '#6C54CC',
      700: '#513F99',
      800: '#362A66',
      900: '#1B1533',
    },

    // Success - Green
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },

    // Warning - Amber/Yellow
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },

    // Danger - Red
    danger: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },

    // Neutrals - Gray scale
    neutral: {
      0: '#FFFFFF',
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      950: '#030712',
    },

    // Status badge colors
    status: {
      inReview: {
        bg: '#FEF3C7',
        text: '#92400E',
        border: '#FCD34D',
      },
      approved: {
        bg: '#D1FAE5',
        text: '#065F46',
        border: '#6EE7B7',
      },
      rejected: {
        bg: '#FEE2E2',
        text: '#991B1B',
        border: '#FCA5A5',
      },
      pending: {
        bg: '#E0E7FF',
        text: '#3730A3',
        border: '#A5B4FC',
      },
      submitted: {
        bg: '#DBEAFE',
        text: '#1E40AF',
        border: '#93C5FD',
      },
    },
  },

  // ===== TYPOGRAPHY =====
  typography: {
    fontFamily: {
      primary: "'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      mono: "'Roboto Mono', 'Courier New', monospace",
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // ===== SPACING =====
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // ===== SHADOWS =====
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // ===== COMPONENT STYLES =====
  components: {
    // Button variants
    button: {
      primary: {
        bg: '#00A9A0',
        bgHover: '#008780',
        text: '#FFFFFF',
        border: 'transparent',
        shadow: 'base',
      },
      secondary: {
        bg: '#F3F4F6',
        bgHover: '#E5E7EB',
        text: '#374151',
        border: '#E5E7EB',
        shadow: 'sm',
      },
      outline: {
        bg: 'transparent',
        bgHover: '#F9FAFB',
        text: '#374151',
        border: '#D1D5DB',
        shadow: 'none',
      },
      ghost: {
        bg: 'transparent',
        bgHover: '#F3F4F6',
        text: '#4B5563',
        border: 'transparent',
        shadow: 'none',
      },
      danger: {
        bg: '#EF4444',
        bgHover: '#DC2626',
        text: '#FFFFFF',
        border: 'transparent',
        shadow: 'base',
      },
    },

    // Card styles
    card: {
      bg: '#FFFFFF',
      border: '#E5E7EB',
      shadow: 'sm',
      radius: 'lg',
      padding: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
      },
    },

    // Badge styles
    badge: {
      radius: 'md',
      padding: '0.25rem 0.75rem',
      fontSize: 'xs',
      fontWeight: 'medium',
    },

    // Input styles
    input: {
      bg: '#FFFFFF',
      border: '#D1D5DB',
      borderFocus: '#00A9A0',
      text: '#111827',
      placeholder: '#9CA3AF',
      radius: 'md',
      padding: '0.625rem 0.875rem',
    },

    // Progress tracker
    progressTracker: {
      circle: {
        size: '2.5rem',
        border: '2px',
        completed: {
          bg: '#00A9A0',
          border: '#00A9A0',
          text: '#FFFFFF',
        },
        active: {
          bg: '#FFFFFF',
          border: '#00A9A0',
          text: '#00A9A0',
        },
        pending: {
          bg: '#FFFFFF',
          border: '#D1D5DB',
          text: '#9CA3AF',
        },
      },
      line: {
        width: '2px',
        completed: '#00A9A0',
        pending: '#E5E7EB',
      },
    },
  },

  // ===== BREAKPOINTS =====
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ===== TRANSITIONS =====
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // ===== Z-INDEX LAYERS =====
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

// ===== UTILITY FUNCTIONS =====

/**
 * Get color from theme palette
 */
export function getColor(path: string): string {
  const keys = path.split('.');
  let value: any = theme.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value || path;
}

/**
 * Get spacing value
 */
export function getSpacing(key: keyof typeof theme.spacing): string {
  return theme.spacing[key];
}

/**
 * Generate status badge classes
 */
export function getStatusBadgeClasses(status: keyof typeof theme.colors.status): string {
  const statusColors = theme.colors.status[status];
  return `bg-[${statusColors.bg}] text-[${statusColors.text}] border border-[${statusColors.border}]`;
}

/**
 * Generate button classes based on variant
 */
export function getButtonClasses(variant: keyof typeof theme.components.button): string {
  const button = theme.components.button[variant];
  return `bg-[${button.bg}] hover:bg-[${button.bgHover}] text-[${button.text}] border border-[${button.border}]`;
}

export type Theme = typeof theme;
export default theme;

