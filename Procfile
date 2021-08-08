release: ENV_SILENT=true node build/ace migration:run --force && node build/ace db:seed && cp .env build/.env
web: cp .env build/.env && npm run start:prod
