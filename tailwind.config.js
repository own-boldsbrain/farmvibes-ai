/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Tonal Stacking (Zinc Scale)
        bg: 'var(--color-bg)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
        surface: 'var(--elevation-surface)',
        'container-low': 'var(--elevation-low)',
        'container-high': 'var(--elevation-high)',
        'container-elevated': 'var(--elevation-elevated)',
        // Kinetic Colors
        accent: {
          gold: '#FFCE00',
          orange: '#FF6600',
          magenta: '#FF0066',
        },
        // Hardware & Status
        status: {
          active: '#25D366',
          error: '#EF4444',
          cache: '#3B82F6',
        }
      },
      backgroundImage: {
        'kinetic-gradient': 'linear-gradient(90deg, #FFCE00 0%, #FF6600 50%, #FF0066 100%)',
      },
      borderRadius: {
        none: '0px', // Strict orthogonal integrity
      }
    }
  }
}
