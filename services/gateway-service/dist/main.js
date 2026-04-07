"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        console.log('App created successfully');
        await app.listen(process.env.PORT ?? 3004);
        console.log(`Server running on port ${process.env.PORT ?? 3004}`);
    }
    catch (err) {
        console.error('Bootstrap error:', err);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map