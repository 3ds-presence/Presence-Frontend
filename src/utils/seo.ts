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

/**
 * Updates the document title and meta description for the current page.
 * Also updates Open Graph and Twitter description tags for consistency.
 */
export function updateSeo(title: string, description: string) {
  document.title = title

  // Update or create the meta description tag
  let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.name = 'description'
    document.head.appendChild(metaDesc)
  }
  metaDesc.content = description

  // Update or create Open Graph description
  let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
  if (!ogDesc) {
    ogDesc = document.createElement('meta')
    ogDesc.setAttribute('property', 'og:description')
    document.head.appendChild(ogDesc)
  }
  ogDesc.content = description

  // Update or create Twitter description
  let twDesc = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')
  if (!twDesc) {
    twDesc = document.createElement('meta')
    twDesc.name = 'twitter:description'
    document.head.appendChild(twDesc)
  }
  twDesc.content = description
}

/**
 * Injects a JSON-LD structured data script into the document head.
 * Returns a cleanup function that removes it.
 */
export function injectJsonLd(data: object): () => void {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)

  return () => {
    document.head.removeChild(script)
  }
}