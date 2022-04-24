import { Registry } from 'monaco-textmate'

export const inverseGrammars: Record<string, string> = {
  'source.css': 'css',
  'text.html.basic': 'html',
  'source.js': 'javascript',
  'source.js.jsx': 'jsx',
  // 'source.svelte': 'svelte',
  'source.tsx': 'tsx',
  'source.ts': 'typescript',
  // 'source.vue': 'vue',
}

export const registry = new Registry({
  getGrammarDefinition: async (scopeName: string) => {
    switch (inverseGrammars[scopeName]) {
      case 'css':
        return {
          format: 'json',
          content: await (await fetch('/monaco/languages/css.json')).text(),
        }
      case 'html':
        return {
          format: 'json',
          content: await (await fetch('/monaco/languages/html.json')).text(),
        }
      case 'jsx':
        return {
          format: 'json',
          content: await (await fetch('/monaco/languages/jsx.json')).text(),
        }
      // case 'svelte':
      //   return {
      //     format: 'json',
      //     content: await (await fetch('/monaco/languages/svelte.json')).text(),
      //   }
      case 'typescript':
        return {
          format: 'json',
          content: await (
            await fetch('/monaco/languages/typescript.json')
          ).text(),
        }
      case 'tsx':
        return {
          format: 'json',
          content: await (await fetch('/monaco/languages/tsx.json')).text(),
        }
      // case 'vue':
      //   return {
      //     format: 'json',
      //     content: await (await fetch('./monaco/languages/vue.json')).text(),
      //   }
      case 'javascript':
      default:
        return {
          format: 'json',
          content: await (
            await fetch('/monaco/languages/javascript.json')
          ).text(),
        }
    }
  },
})

