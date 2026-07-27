# 3DS Presence — Discord Rich Presence for Nintendo 3DS
# Copyright (C) 2026 3DS Presence - LeonLeBreton
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

# Stage 1: Build Frontend
FROM docker.io/library/node:22-alpine AS builder
ARG VITE_DISCORD_OAUTH_URL
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY . .
# Generate available_titles.json from the imgs directory structure
RUN apk add --no-cache jq && \
    ls public/imgs/ | jq -R -s \
      'split("\n") | map(select(length > 0 and test("^[0-9a-fA-F]{16}$")))' \
      > public/imgs/available_titles.json
RUN npm run build

# Stage 2: Nginx runtime
FROM docker.io/library/nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]