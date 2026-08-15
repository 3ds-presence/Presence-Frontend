// 3DS Presence — Discord Rich Presence for Nintendo 3DS
// Copyright (C) 2026 3DS Presence - LeonLeBreton
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.


import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { mockBackend } from './mock-backend.js'

export default defineConfig(({ mode }) => {
  // Use default Turnstile site key if none is provided.
  // This allows the frontend to run standalone without a real Turnstile site key.
  const env = loadEnv(mode, process.cwd(), '')
  const siteKey = env.VITE_TURNSTILE_SITEKEY || process.env.VITE_TURNSTILE_SITEKEY
  const define: Record<string, string> = {}
  if (!siteKey) {
    define['import.meta.env.VITE_TURNSTILE_SITEKEY'] = JSON.stringify('1x00000000000000000000AA')
  }

  return {
    plugins: [vue(), mockBackend()],
    server: {
      port: 5556,
    },
    define,
  }
})