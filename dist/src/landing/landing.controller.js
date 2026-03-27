"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../utils/decorators/public.decorator");
let LandingController = class LandingController {
    renderLanding() {
        console.log('Landing controller HIT');
        return {
            modules: [
                {
                    title: 'Administrator',
                    slug: 'admin',
                    swaggerLink: '/docs/admin',
                    icon: '/public/icons/administrator.png',
                    status: 'New',
                },
                {
                    title: 'Mastertable',
                    slug: 'mastertable',
                    swaggerLink: '/docs/mastertable',
                    icon: '/public/icons/mastertable.png',
                    status: 'New',
                },
                {
                    title: 'User Management',
                    slug: 'user-management',
                    swaggerLink: '/docs/user-management',
                    icon: '/public/icons/user.png',
                    status: 'New',
                },
                {
                    title: 'Managers Access',
                    slug: 'manager',
                    swaggerLink: '/docs/manager',
                    icon: '/public/icons/manager.png',
                    status: 'Internal',
                },
                {
                    title: 'Human Resources',
                    slug: 'hris',
                    swaggerLink: '/docs/hris',
                    icon: '/public/icons/hr-manager.png',
                    status: 'Beta',
                },
                {
                    title: 'DB Query',
                    slug: 'db-query',
                    swaggerLink: '/docs/db-query',
                    icon: '/public/icons/database.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'Accounting',
                    slug: 'accounting',
                    swaggerLink: '/docs/accounting',
                    icon: '/public/icons/accounting.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'Purchasing',
                    slug: 'purchasing',
                    swaggerLink: '/docs/purchasing',
                    icon: '/public/icons/purchasing.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'Inventory',
                    slug: 'inventory',
                    swaggerLink: '/docs/inventory',
                    icon: '/public/icons/inventory.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'Marketing & Operations',
                    slug: 'operations',
                    swaggerLink: '/docs/marketingOps',
                    icon: '/public/icons/operations.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'Finance',
                    slug: 'finance',
                    swaggerLink: '/docs/finance',
                    icon: '/public/icons/finance.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'Stars',
                    slug: 'stars',
                    swaggerLink: '/docs/stars',
                    icon: '/public/icons/satelite.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'Biometric',
                    slug: 'biometric',
                    swaggerLink: '/docs/biometric',
                    icon: '/public/icons/biometric.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'Payroll',
                    slug: 'payroll',
                    swaggerLink: '/docs/payroll',
                    icon: '/public/icons/payroll.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'Corporate Services',
                    slug: 'corporate',
                    swaggerLink: '/docs/corporate-services',
                    icon: '/public/icons/corporate.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'IT Helpdesk',
                    slug: 'helpdesk',
                    swaggerLink: '/docs/it-helpdesk',
                    icon: '/public/icons/helpdesk.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
                {
                    title: 'Compliance',
                    slug: 'compliance',
                    swaggerLink: '/docs/compliance',
                    icon: '/public/icons/compliance.png',
                    comingSoon: true,
                    status: 'Coming Soon',
                },
            ],
        };
    }
    stayTuned(slug) {
        console.log(`${slug} page HIT`);
        return { slug };
    }
};
exports.LandingController = LandingController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, common_1.Render)('index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LandingController.prototype, "renderLanding", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('docs/:slug'),
    (0, common_1.Render)('stay-tuned'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LandingController.prototype, "stayTuned", null);
exports.LandingController = LandingController = __decorate([
    (0, common_1.Controller)()
], LandingController);
//# sourceMappingURL=landing.controller.js.map