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

import type { Plugin, Connect } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Fake backend for local development.
 *
 * Intercepts every `/api/*` request and returns simulated responses without
 * any real verification (no Turnstile, no Discord OAuth). This lets the
 * frontend run standalone via `npm run dev` without the Rust backend.
 */

// Send an `application/x-www-form-urlencoded` response.
function sendForm(res: ServerResponse, status: number, params: Record<string, string>): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/x-www-form-urlencoded')
  res.end(new URLSearchParams(params).toString())
}

export function mockBackend(): Plugin {
  return {
    name: 'mock-backend',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        const url = req.url || ''

        // Only handle POST requests under /api/.
        if (!url.startsWith('/api/') || req.method !== 'POST') {
          return next()
        }

        // Strip any query string to get the route path.
        const path = url.split('?')[0]

        switch (path) {
          case '/api/oauth/start': {
            // Simulate the Discord authorization URL. Redirect back to the
            // frontend with a fake `code` + `state` so the register flow runs.
            const redirectUrl = 'http://localhost:5556/?code=fake_discord_code&state=fake_state'
            sendForm(res, 200, { url: redirectUrl })
            return
          }

          case '/api/register': {
            // Simulate a registration that requires consent.
            sendForm(res, 200, {
              needs_consent: 'true',
              temp_token: 'fake-temp-token-1234',
            })
            return
          }

          case '/api/confirm-consent': {
            // Simulate consent confirmation.
            sendForm(res, 200, {
              uuid: 'fake-uuid-1234-5678-9abc',
              aes_key_hex: 'a'.repeat(64),
            })
            return
          }

          case '/api/reset_aes': {
            // Simulate an AES key reset.
            sendForm(res, 200, {
              aes_key_hex: 'b'.repeat(64),
            })
            return
          }

          case '/api/account/export': {
            // Simulate a data export (JSON file download).
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.setHeader(
              'Content-Disposition',
              'attachment; filename="3ds-presence-export.json"'
            )
            res.end(
              JSON.stringify(
                {
                  uuid: 'fake-uuid-1234-5678-9abc',
                  exported_at: new Date().toISOString(),
                  data: 'fake export data',
                },
                null,
                2
              )
            )
            return
          }

          case '/api/account/delete': {
            // Simulate account deletion.
            res.statusCode = 200
            res.end('')
            return
          }

          default:
            return next()
        }
      })
    },
  }
}