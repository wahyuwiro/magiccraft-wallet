// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import webExtension from '@samrum/vite-plugin-web-extension'
import { existsSync, readdirSync, renameSync, copyFileSync, writeFileSync, mkdirSync } from 'fs'

// Import manifest as plain object for plugin-web-extension (optional)
import manifest from './manifest.json' // no assert needed

function copyManifestPlugin() {
  return {
    name: 'copy-manifest',
    closeBundle() {
      const distDir = 'dist'
      const assetsDir = `${distDir}/assets`

      // 1) Read original manifest (source)
      let manifestSource
      try {
        manifestSource = JSON.parse(require('fs').readFileSync('manifest.json', 'utf-8'))
      } catch (e) {
        this.error('Could not read manifest.json in project root')
        return
      }

      mkdirSync(distDir, { recursive: true })

      // if file on dist/src
      if (existsSync(`${distDir}/src/background.js`)) {
        renameSync(`${distDir}/src/background.js`, `${distDir}/background.js`)
      }
      if (existsSync(`${distDir}/src/content.js`)) {
        renameSync(`${distDir}/src/content.js`, `${distDir}/content.js`)
      }

      // 2) Try to locate built background and content files under dist/assets or dist/assets/src
      // Helper: search folder recursively (only one level under assets and assets/src needed)
      const candidatePaths = []

      if (existsSync(assetsDir)) {
        // files directly under assets
        readdirSync(assetsDir).forEach(f => candidatePaths.push({ dir: assetsDir, file: f }))
        // check assets/src folder too
        if (existsSync(`${assetsDir}/src`)) {
          readdirSync(`${assetsDir}/src`).forEach(f => candidatePaths.push({ dir: `${assetsDir}/src`, file: f }))
        }
      }

      // find background and content files (start with names)
      const bgCandidate = candidatePaths.find(p => /^background.*\.js$/.test(p.file))
      const contentCandidate = candidatePaths.find(p => /^content.*\.js$/.test(p.file))
      
      // If found, move/rename them to dist/background.js and dist/content.js
      if (bgCandidate) {
        const srcPath = `${bgCandidate.dir}/${bgCandidate.file}`
        const destPath = `${distDir}/background.js`
        try {
          renameSync(srcPath, destPath)
        } catch (err) {
          // fallback: copy if rename fails
          copyFileSync(srcPath, destPath)
        }
      }

      if (contentCandidate) {
        const srcPath = `${contentCandidate.dir}/${contentCandidate.file}`
        const destPath = `${distDir}/content.js`
        try {
          renameSync(srcPath, destPath)
        } catch (err) {
          copyFileSync(srcPath, destPath)
        }
      }

      // 3) Build the dist manifest (rewrite background & content script paths to final js)
      const manifestOut = JSON.parse(JSON.stringify(manifestSource)) // clone

      // background -> background.js (root of dist)
      manifestOut.background = manifestOut.background || {}
      manifestOut.background.service_worker = 'background.js'

      // content_scripts -> replace src paths with content.js
      if (Array.isArray(manifestOut.content_scripts)) {
        manifestOut.content_scripts = manifestOut.content_scripts.map(cs => {
          const newCs = { ...cs }
          if (Array.isArray(newCs.js)) {
            // replace any src/*.ts entry with 'content.js' (single)
            newCs.js = ['content.js']
          }
          return newCs
        })
      }

      // 4) Write new manifest into dist/manifest.json
      writeFileSync(`${distDir}/manifest.json`, JSON.stringify(manifestOut, null, 2), 'utf-8')

      // 5) Also ensure popup.html and icons were copied by plugin-web-extension/public handling; nothing else to do.
      // Note: plugin-web-extension usually copies public/ to dist/ automatically.

      this.warn('[copy-manifest] dist manifest written and background/content adjusted')
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    // webExtension will help copy public files like popup.html and icons; pass manifest for dev assist
    webExtension({
      manifest
    }),
    copyManifestPlugin()
  ],
  build: {
    outDir: 'dist',

  }
})
