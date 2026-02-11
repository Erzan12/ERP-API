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
          description: 'Manages audit trails, security clearance level and overall system management',
          slug: 'Admin',
          swaggerLink: '/api/docs/admin',
          icon: '/public/icons/user.png'
        },
        {
          title: 'Masterstable',
          description: 'Manages overall organization structure of the company',
          slug: 'masterstable',
          swaggerLink: '/api/docs/masterstable',
          icon: '/public/icons/masterstable.png'
        },
        {
          title: 'Managers Access',
          description: 'Manager acts as the department head and controls overall workflow in a department',
          slug: 'manager',
          swaggerLink: '/api/docs/manager',
          icon: '/public/icons/manager.png'
        },
        {
          title: 'Human Resources',
          description: 'Manages lifecycle of all employees',
          slug: 'hris',
          swaggerLink: '/api/docs/hris',
          icon: '/public/icons/hr-manager.png'
        },
        {
          title: 'Accounting',
          description: 'Manages lifecycle of all employees',
          slug: 'accounting',
          swaggerLink: '/api/Accouting',
          icon: '/public/icons/accounting.png'
        },
        {
          title: 'Purchasing',
          description: 'Manages lifecycle of all employees',
          slug: 'purchasing',
          swaggerLink: '/api/Purchasing',
          icon: '/public/icons/purchasing.png'
        },
        {
          title: 'Inventory',
          description: 'Manages lifecycle of all employees',
          slug: 'inventory',
          swaggerLink: '/api/Inventory',
          icon: '/public/icons/inventory.png'
        },
        {
          title: 'Marketing & Operations',
          description: 'Manages lifecycle of all employees',
          slug: 'operations',
          swaggerLink: '/api/MarketingOps',
          icon: '/public/icons/operations.png'
        },
        {
          title: 'Finance',
          description: 'Manages lifecycle of all employees',
          slug: 'finance',
          swaggerLink: '/api/Finance',
          icon: '/public/icons/finance.png'
        },
        {
          title: 'Stars',
          description: 'Manages lifecycle of all employees',
          slug: 'stars',
          swaggerLink: '/api/STARS',
          icon: '/public/icons/satelite.png'
        },
        {
          title: 'Biometric',
          description: 'Manages lifecycle of all employees',
          slug: 'Biometric',
          swaggerLink: '/api/stay-tuned',
          icon: '/public/icons/biometric.png'
        },
        {
          title: 'Payroll',
          description: 'Manages lifecycle of all employees',
          slug: 'payroll',
          swaggerLink: '/api/Payroll',
          icon: '/public/icons/payroll.png'
        },
        {
          title: 'Corporate Services',
          description: 'Manages lifecycle of all employees',
          slug: 'corporate',
          swaggerLink: '/api/Corporate-Services',
          icon: '/public/icons/corporate.png'
        },
        {
          title: 'IT Helpdesk',
          description: 'Manages lifecycle of all employees',
          slug: 'helpdesk',
          swaggerLink: '/api/IT-helpdesk',
          icon: '/public/icons/helpdesk.png'
        },
        {
          title: 'Compliance',
          description: 'Manages lifecycle of all employees',
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
