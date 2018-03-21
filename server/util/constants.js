module.exports = {
    "workers": process.env.WEB_CONCURRENCY || 1,
    "port": process.env.PORT || 8080,
    "cacheMaxAge": process.env.CACHE_MAXAGE, // 86400
    "environment": process.env.AMBIENTE,
    "applicationID": process.env.NEW_RELIC_BROWSER_ID,
    "licenseKey": process.env.NEW_RELIC_BROWSER_KEY,
    "googleKey": process.env.GOOGLE_API,
    "ichegouBase": process.env.ICHEGOU_API + "/api/v5",
    "adminHost": process.env.ADMIN_HOST || "admin.ichegou.com.br",
    "quotaguard": process.env.QUOTAGUARDSTATIC_URL,
    "os": "web",
    "serverOrigin": "NodeJS",
    "role_god": 1,
    "role_super": 2,
    "role_admin": 3,
    "role_caixa": 4,
    "role_delivery": 5,
    "role_customer": 6,
    "gateway_url": process.env.GATEWAY_URL,
    "id_analytics": process.env.ID_ANALYTICS
}
