import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Demo copy is full of apostrophes; escaping them changes nothing on screen.
      'react/no-unescaped-entities': 'off',
      // React Compiler diagnostics. These flag patterns the demo relies on and
      // that predate the Next.js migration (form resets on open, simulated
      // timers, generated references) — kept visible as warnings rather than
      // rewritten, so behaviour stays identical to the Vite build.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/static-components': 'warn',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
