
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
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
				racing: {
					red: '#E10600',
					black: '#15151E',
					gray: '#32323A',
					blue: '#0090FF',
					yellow: '#FFBE00',
					white: '#FFFFFF',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'pulse-racing': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'slide-up': {
					from: { 
						opacity: '0',
						transform: 'translateY(20px)' 
					},
					to: { 
						opacity: '1',
						transform: 'translateY(0)' 
					}
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'scale-in': {
					from: { 
						transform: 'scale(0.95)',
						opacity: '0'
					},
					to: { 
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'glow': {
					from: {
						boxShadow: '0 0 5px rgba(225, 6, 0, 0.3), 0 0 10px rgba(225, 6, 0, 0.2)'
					},
					to: {
						boxShadow: '0 0 10px rgba(225, 6, 0, 0.5), 0 0 20px rgba(225, 6, 0, 0.3)'
					}
				},
				'shine': {
					from: { transform: 'translateX(-100%) rotate(30deg)' },
					to: { transform: 'translateX(300%) rotate(30deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-racing': 'pulse-racing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'slide-up': 'slide-up 0.5s ease forwards',
				'fade-in': 'fade-in 0.5s ease forwards',
				'scale-in': 'scale-in 0.3s ease forwards',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'shine': 'shine 4s linear infinite'
			},
			backgroundImage: {
				'carbon-fiber': "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"15\" height=\"15\"><rect x=\"0\" y=\"0\" width=\"15\" height=\"15\" fill=\"%2315151E\"/><path d=\"M0,15 L15,0\" stroke=\"%2320202A\" stroke-width=\"1\"/><path d=\"M15,15 L0,0\" stroke=\"%2320202A\" stroke-width=\"1\"/></svg>')",
				'racing-gradient': 'linear-gradient(to right, #E10600, #15151E)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
