// src/landing/landing.controller.ts
import { Controller, Get, Param, Render } from '@nestjs/common';
import { get } from 'http';
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
          icon: '/public/icons/user.png',
          status: 'New'
        },
        {
          title: 'Masterstable',
          slug: 'masterstable',
          swaggerLink: '/docs/masterstable',
          icon: '/public/icons/masterstable.png',
          status: 'New'
        },
        {
          title: 'Managers Access',
          slug: 'manager',
          swaggerLink: '/docs/manager',
          icon: '/public/icons/manager.png',
          status: 'Internal'
        },
        {
          title: 'Human Resources',
          slug: 'hris',
          swaggerLink: '/docs/hris',
          icon: '/public/icons/hr-manager.png',
          status: 'Beta'
        },
        {
          title: 'DB Query',
          slug: 'db-query',
          swaggerLink: '/api/db-query',
          icon: '/public/icons/database.png',
          comingSoon: true,
          status: 'Deprecated'
        },
        {
          title: 'Accounting',
          slug: 'accounting',
          swaggerLink: '/api/accounting',
          icon: '/public/icons/accounting.png',
          comingSoon: true, // put true value to disable target="blank"
          status: 'Coming Soon',
        },
        {
          title: 'Purchasing',
          slug: 'purchasing',
          swaggerLink: '/api/purchasing',
          icon: '/public/icons/purchasing.png',
          comingSoon: true,
          status: 'Coming Soon'
        },
        {
          title: 'Inventory',
          slug: 'inventory',
          swaggerLink: '/api/docs/inventory',
          icon: '/public/icons/inventory.png',
          comingSoon: true,
          status: 'Coming Soon'
        },
        {
          title: 'Marketing & Operations',
          slug: 'operations',
          swaggerLink: 'marketingOps',
          icon: '/public/icons/operations.png',
          comingSoon: true,
          status: 'Coming Soon'
        },
        {
          title: 'Finance',
          slug: 'finance',
          swaggerLink: '/api/finance',
          icon: '/public/icons/finance.png',
          comingSoon: true,
          status: 'Coming Soon'
        },
        {
          title: 'Stars',
          slug: 'stars',
          swaggerLink: '/api/stars',
          icon: '/public/icons/satelite.png',
          comingSoon: true,
          status: 'Coming Soon'
        },
        {
          title: 'Biometric',
          slug: 'biometric',
          swaggerLink: '/api/biometric',
          icon: '/public/icons/biometric.png',
          comingSoon: true,
          status: 'Coming Soon'
        },
        {
          title: 'Payroll',
          slug: 'payroll',
          swaggerLink: '/api/payroll',
          icon: '/public/icons/payroll.png',
          comingSoon: true,
          status: 'Coming Soon'
        },
        {
          title: 'Corporate Services',
          slug: 'corporate',
          swaggerLink: '/api/corporate-services',
          icon: '/public/icons/corporate.png',
          comingSoon: true,
          status: 'Coming Soon'
        },
        {
          title: 'IT Helpdesk',
          slug: 'helpdesk',
          swaggerLink: '/api/it-helpdesk',
          icon: '/public/icons/helpdesk.png',
          comingSoon: true,
          status: 'Coming Soon'
        },
        {
          title: 'Compliance',
          slug: 'compliance',
          swaggerLink: '/api/compliance',
          icon: '/public/icons/compliance.png',
          comingSoon: true,
          status: 'Coming Soon'
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
