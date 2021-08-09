import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'

export default {
	uiEnabled: true, //disable or enable swaggerUi route
	uiUrl: 'docs', // url path to swaggerUI
	specEnabled: true, //disable or enable swagger.json route
	specUrl: '/swagger.json',
  validatorUrl: null,
	middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

	options: {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'Main Bersama',
				version: '1.0.0',
				description: 'RestAPI Main Bersama by Bintang Rezeka Ramadani'
			}
		},
    components: {
      securitySchemes: {
        bearerAuth:{
          type: 'http',
          scheme: 'bearer'
        },
      },
    },
		apis: [
			'app/**/*.ts',
			'docs/swagger/**/*.yml',
			'start/routes.ts'
		],
		basePath: '/',
    validatorUrl: null,
	},
	mode: 'RUNTIME',
  specFilePath: 'docs/swagger.json'
} as SwaggerConfig
