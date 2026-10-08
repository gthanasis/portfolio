import { createRenderer, type RehypeExpressiveCodeOptions } from 'rehype-expressive-code'
import { toHtml } from 'hast-util-to-html'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'

// Expressive Code renders code blocks (frames, diffs, marks, copy button) at build time.
// Dark is the default theme; light follows the site's [data-theme] switch.
export const codeOptions: RehypeExpressiveCodeOptions = {
  themes: ['github-dark-default', 'github-light-default'],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
  defaultProps: { showLineNumbers: false },
  styleOverrides: {
    borderRadius: '12px',
    borderColor: 'hsl(var(--border))',
    codeFontFamily: 'var(--font-mono), ui-monospace, monospace',
    codeFontSize: '0.86rem',
    codeLineHeight: '1.65',
    uiFontFamily: 'var(--font-sans), ui-sans-serif, sans-serif',
    focusBorder: 'hsl(var(--ring))',
    codeBackground: 'hsl(var(--card))',
    frames: {
      shadowColor: 'transparent',
      editorTabBarBackground: 'hsl(var(--background))',
      editorTabBarBorderBottomColor: 'hsl(var(--border))',
      editorActiveTabBackground: 'hsl(var(--card))',
      editorActiveTabIndicatorTopColor: 'hsl(var(--primary))',
      editorActiveTabIndicatorBottomColor: 'transparent',
      terminalBackground: 'hsl(var(--card))',
      terminalTitlebarBackground: 'hsl(var(--background))',
      terminalTitlebarBorderBottomColor: 'hsl(var(--border))',
    },
    // Marks in the brand accent; diffs in the site's add/remove colours.
    textMarkers: {
      markBackground: 'hsl(var(--primary) / .12)',
      markBorderColor: 'hsl(var(--primary) / .55)',
      insBackground: 'hsl(var(--diff-add-bg))',
      insBorderColor: 'hsl(var(--diff-add) / .6)',
      insDiffIndicatorColor: 'hsl(var(--diff-add))',
      delBackground: 'hsl(var(--destructive) / .1)',
      delBorderColor: 'hsl(var(--destructive) / .55)',
      delDiffIndicatorColor: 'hsl(var(--destructive))',
    },
  },
}

// One renderer for every post. Its shared CSS and client JS are emitted once by the
// blog layout (<CodeAssets />), so they are stripped from the per-block output here.
let renderer: ReturnType<typeof createRenderer> | undefined
const shared = () => (renderer ??= createRenderer(codeOptions))

export async function codeRenderer() {
  return { ...(await shared()), baseStyles: '', themeStyles: '', jsModules: [] }
}

export async function codeAssets() {
  const { baseStyles, themeStyles, jsModules } = await shared()
  return { css: baseStyles + themeStyles, js: jsModules.join('\n') }
}

/** Renders one code block outside the MDX pipeline (e.g. a file shown by a component) to HTML. Long lines wrap. */
export async function renderCode(code: string, language: string, title?: string) {
  const { ec } = await shared()
  const { renderedGroupAst, styles } = await ec.render({ code, language, props: { title, wrap: true } })
  const css = [...styles].join('')
  return (css ? `<style>${css}</style>` : '') + toHtml(renderedGroupAst)
}
