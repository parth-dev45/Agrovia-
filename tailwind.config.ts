import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
		// 8px Grid System
		spacing: {
			'0.5': '2px',   // 0.125rem
			'1': '4px',     // 0.25rem
			'1.5': '6px',   // 0.375rem
			'2': '8px',     // 0.5rem
			'2.5': '10px',  // 0.625rem
			'3': '12px',    // 0.75rem
			'3.5': '14px',  // 0.875rem
			'4': '16px',    // 1rem
			'5': '20px',    // 1.25rem
			'6': '24px',    // 1.5rem
			'7': '28px',    // 1.75rem
			'8': '32px',    // 2rem
			'9': '36px',    // 2.25rem
			'10': '40px',   // 2.5rem
			'11': '44px',   // 2.75rem
			'12': '48px',   // 3rem
			'14': '56px',   // 3.5rem
			'16': '64px',   // 4rem
			'18': '72px',   // 4.5rem
			'20': '80px',   // 5rem
			'24': '96px',   // 6rem
			'28': '112px',  // 7rem
			'32': '128px',  // 8rem
			'36': '144px',  // 9rem
			'40': '160px',  // 10rem
			'44': '176px',  // 11rem
			'48': '192px',  // 12rem
			'52': '208px',  // 13rem
			'56': '224px',  // 14rem
			'60': '240px',  // 15rem
			'64': '256px',  // 16rem
			'72': '288px',  // 18rem
			'80': '320px',  // 20rem
			'96': '384px',  // 24rem
		},
		colors: {
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			primary: {
				DEFAULT: 'hsl(var(--primary))',
				foreground: 'hsl(var(--primary-foreground))',
				50: 'hsl(var(--primary-50))',
				100: 'hsl(var(--primary-100))',
				200: 'hsl(var(--primary-200))',
				300: 'hsl(var(--primary-300))',
				400: 'hsl(var(--primary-400))',
				500: 'hsl(var(--primary))',
				600: 'hsl(var(--primary-600))',
				700: 'hsl(var(--primary-700))',
				800: 'hsl(var(--primary-800))',
				900: 'hsl(var(--primary-900))',
				950: 'hsl(var(--primary-950))',
			},
			secondary: {
				DEFAULT: 'hsl(var(--secondary))',
				foreground: 'hsl(var(--secondary-foreground))'
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))'
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			accent: {
				DEFAULT: 'hsl(var(--accent))',
				foreground: 'hsl(var(--accent-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			sidebar: {
				DEFAULT: 'hsl(var(--sidebar-background))',
				foreground: 'hsl(var(--sidebar-foreground))',
				primary: 'hsl(var(--sidebar-primary))',
				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				accent: 'hsl(var(--sidebar-accent))',
				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				border: 'hsl(var(--sidebar-border))',
				ring: 'hsl(var(--sidebar-ring))'
			},
			fresh: {
				DEFAULT: 'hsl(var(--fresh))',
				foreground: 'hsl(var(--fresh-foreground))'
			},
			warning: {
				DEFAULT: 'hsl(var(--warning))',
				foreground: 'hsl(var(--warning-foreground))'
			},
			expired: {
				DEFAULT: 'hsl(var(--expired))',
				foreground: 'hsl(var(--expired-foreground))'
			}
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
			'2xs': '0.25rem',  // 4px
			'xs': '0.375rem',  // 6px
			'sm': '0.5rem',    // 8px
			'md': '0.75rem',   // 12px
			'lg': '1rem',      // 16px
			'xl': '1.25rem',   // 20px
			'2xl': '1.5rem',   // 24px
			'3xl': '2rem',     // 32px
			'4xl': '2.5rem',   // 40px
			'5xl': '3rem',     // 48px
  		},
		// Enhanced Typography Scale
		fontSize: {
			'2xs': ['0.625rem', { lineHeight: '0.75rem' }],    // 10px
			'xs': ['0.75rem', { lineHeight: '1rem' }],         // 12px
			'sm': ['0.875rem', { lineHeight: '1.25rem' }],     // 14px
			'base': ['1rem', { lineHeight: '1.5rem' }],        // 16px
			'lg': ['1.125rem', { lineHeight: '1.75rem' }],     // 18px
			'xl': ['1.25rem', { lineHeight: '1.75rem' }],      // 20px
			'2xl': ['1.5rem', { lineHeight: '2rem' }],         // 24px
			'3xl': ['1.875rem', { lineHeight: '2.25rem' }],    // 30px
			'4xl': ['2.25rem', { lineHeight: '2.5rem' }],      // 36px
			'5xl': ['3rem', { lineHeight: '1' }],              // 48px
			'6xl': ['3.75rem', { lineHeight: '1' }],           // 60px
			'7xl': ['4.5rem', { lineHeight: '1' }],            // 72px
			'8xl': ['6rem', { lineHeight: '1' }],              // 96px
			'9xl': ['8rem', { lineHeight: '1' }],              // 128px
		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
			// Enhanced Animations
			'fade-in': {
				'0%': { opacity: '0' },
				'100%': { opacity: '1' }
			},
			'fade-in-up': {
				'0%': { opacity: '0', transform: 'translateY(10px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			},
			'fade-in-down': {
				'0%': { opacity: '0', transform: 'translateY(-10px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			},
			'scale-in': {
				'0%': { opacity: '0', transform: 'scale(0.95)' },
				'100%': { opacity: '1', transform: 'scale(1)' }
			},
			'slide-in-right': {
				'0%': { opacity: '0', transform: 'translateX(-10px)' },
				'100%': { opacity: '1', transform: 'translateX(0)' }
			},
			'slide-in-left': {
				'0%': { opacity: '0', transform: 'translateX(10px)' },
				'100%': { opacity: '1', transform: 'translateX(0)' }
			},
			'bounce-subtle': {
				'0%, 100%': { transform: 'translateY(0)' },
				'50%': { transform: 'translateY(-2px)' }
			},
			'pulse-soft': {
				'0%, 100%': { opacity: '1' },
				'50%': { opacity: '0.8' }
			},
			'gradient-x': {
				'0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
				'50%': { 'background-size': '200% 200%', 'background-position': 'right center' }
			},
			'shimmer': {
				'0%': { transform: 'translateX(-100%)' },
				'100%': { transform: 'translateX(100%)' }
			},
			'shake': {
				'0%, 100%': { transform: 'translateX(0)' },
				'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
				'20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			'fade-in': 'fade-in 0.5s ease-out',
			'fade-in-up': 'fade-in-up 0.5s ease-out',
			'fade-in-down': 'fade-in-down 0.5s ease-out',
			'scale-in': 'scale-in 0.3s ease-out',
			'slide-in-right': 'slide-in-right 0.3s ease-out',
			'slide-in-left': 'slide-in-left 0.3s ease-out',
			'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
			'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
			'gradient-x': 'gradient-x 3s ease infinite',
			'shimmer': 'shimmer 2s ease-in-out infinite',
			'shake': 'shake 0.4s ease-in-out'
  		},
  		boxShadow: {
  			'2xs': 'var(--shadow-2xs)',
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'SF Pro Display',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'Fira Code',
  				'ui-monospace',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'monospace'
  			]
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
