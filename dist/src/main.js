"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const app_swagger_1 = require("./app/app.swagger");
const global_prefix_helper_1 = require("./utils/helpers/global-prefix.helper");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const prisma_exception_filter_1 = require("./utils/filters/prisma-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    app.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptionFilter());
    const adapter = new adapter_pg_1.PrismaPg({
        connectionString: process.env.DATABASE_URL,
    });
    app.enableCors({
        origin: ['http://localhost:3002', 'http://localhost:3003'],
        methods: 'GET,POST,PUT,PATCH,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    });
    new client_1.PrismaClient({ adapter, log: ['query'] });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    (0, global_prefix_helper_1.setupGlobalPrefix)(app);
    (0, app_swagger_1.setupAppSwagger)(app);
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public'), {
        prefix: '/public',
    });
    app.setBaseViewsDir((0, path_1.join)(process.cwd(), 'views'));
    app.setViewEngine('hbs');
    await app.listen(3000, () => {
        console.log('Server is running at http://localhost:3000');
        console.log('Swagger API is running at http://localhost:3000/docs');
        console.log('Prisma Studio is running at http://localhost:51212');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map