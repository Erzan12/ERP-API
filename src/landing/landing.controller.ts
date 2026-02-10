// src/landing/landing.controller.ts
import { Controller, Get, Render } from '@nestjs/common';
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
          title: 'Manager',
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
      ],
    };
  }
  // getHello() {
  //   return 'Hello world';
  // }
}
