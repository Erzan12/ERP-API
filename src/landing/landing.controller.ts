// src/landing/landing.controller.ts
import { Controller, Get, Param, Render } from '@nestjs/common';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller()
export class LandingController {
  @Public()
  @Get()
  @Render('index')
  renderLanding() {
    console.log('Landing controller HIT'); // 🔍 debug

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
          comingSoon: true, // put true value to disable target="blank"
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

  @Public()
  @Get('docs/:slug')
  @Render('stay-tuned')
  stayTuned(@Param('slug') slug: string) {
    console.log(`${slug} page HIT`);
    return { slug };
  }
  // getHello() {
  //   return 'Hello world';
  // }
}
