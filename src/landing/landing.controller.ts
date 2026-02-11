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
          slug: 'Admin',
          swaggerLink: '/api/docs/admin',
          icon: '/public/icons/user.png'
        },
        {
          title: 'Masterstable',
          slug: 'masterstable',
          swaggerLink: '/api/docs/masterstable',
          icon: '/public/icons/masterstable.png'
        },
        {
          title: 'Managers Access',
          slug: 'manager',
          swaggerLink: '/api/docs/manager',
          icon: '/public/icons/manager.png'
        },
        {
          title: 'Human Resources',
          slug: 'hris',
          swaggerLink: '/api/docs/hris',
          icon: '/public/icons/hr-manager.png'
        },
        {
          title: 'Accounting',
          slug: 'accounting',
          swaggerLink: '/api/Accouting',
          icon: '/public/icons/accounting.png'
        },
        {
          title: 'Purchasing',
          slug: 'purchasing',
          swaggerLink: '/api/Purchasing',
          icon: '/public/icons/purchasing.png'
        },
        {
          title: 'Inventory',
          slug: 'inventory',
          swaggerLink: '/api/Inventory',
          icon: '/public/icons/inventory.png'
        },
        {
          title: 'Marketing & Operations',
          slug: 'operations',
          swaggerLink: '/api/MarketingOps',
          icon: '/public/icons/operations.png'
        },
        {
          title: 'Finance',
          slug: 'finance',
          swaggerLink: '/api/Finance',
          icon: '/public/icons/finance.png'
        },
        {
          title: 'Stars',
          slug: 'stars',
          swaggerLink: '/api/STARS',
          icon: '/public/icons/satelite.png'
        },
        {
          title: 'Biometric',
          slug: 'Biometric',
          swaggerLink: '/api/Biometric',
          icon: '/public/icons/biometric.png'
        },
        {
          title: 'Payroll',
          slug: 'payroll',
          swaggerLink: '/api/Payroll',
          icon: '/public/icons/payroll.png'
        },
        {
          title: 'Corporate Services',
          slug: 'corporate',
          swaggerLink: '/api/Corporate-Services',
          icon: '/public/icons/corporate.png'
        },
        {
          title: 'IT Helpdesk',
          slug: 'helpdesk',
          swaggerLink: '/api/IT-helpdesk',
          icon: '/public/icons/helpdesk.png'
        },
        {
          title: 'Compliance',
          slug: 'compliance',
          swaggerLink: '/api/Compliance',
          icon: '/public/icons/compliance.png'
        },
      ],
    };
  }

  @Public()
  @Get(':slug')
  @Render('stay-tuned')
  stayTuned(@Param('slug') slug: string) {

    console.log(`${slug} page HIT`); 
    return { slug };
  }
  // getHello() {
  //   return 'Hello world';
  // }
}
