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
            title: 'Authentication',
            description: 'Login, logout, password reset',
            tag: 'Authentication',
            swaggerLink: '/api#/Authentication',
            icon: '/public/icons/insurance.png'
            // endpoints: [
            //   {
            //     method: 'POST',
            //     path: '/auth/login',
            //     summary: 'User authorized login',
            //     public: true,
            //   },
            //   {
            //     method: 'POST',
            //     path: '/auth/logout',
            //     summary: 'User logout',
            //     public: false,
            //   },
            //   {
            //     method: 'POST',
            //     path: '/auth/reset-password?token=',
            //     summary: 'Reset password with token',
            //     public: true,
            //   },
            // ],
        },
        {
          title: 'Admin - Security & Audit',
          description: 'Manage audit trails and security clearance level',
          slug: 'admin-security',
          swaggerLink: '/api#/Admin%20-%20Security%20%26%20Audit',
          icon: '/public/icons/user.png'
        },
        {
          title: 'Admin - System Management',
          description: 'Administer modules, submodules, and role permissions',
          slug: 'admin-system-management',
          swaggerLink: '/api#/Admin%20-%20System%20Management',
          icon: '/public/icons/user.png'
        },
        {
          title: 'Admin - Mastertables',
          description: 'Manage organization structure such as companies, departments and etc',
          slug: 'admin-mastertables',
          swaggerLink: '/api#/Admin%20-%20Mastertables',
          icon: '/public/icons/user.png'
        },
        {
          title: 'Manager',
          description: 'Manager managing users account, tokens etc.',
          slug: 'manager',
          swaggerLink: '/api#/Manager',
          icon: '/public/icons/manager.png'
        },
        {
          title: 'Human Resources',
          description: 'Managing lifecycle of employees',
          slug: 'hr',
          swaggerLink: '/api#/Human%20Resources',
          icon: '/public/icons/hr-manager.png'
        },
        // {
        //   title: 'Profile',
        //   description: 'User profile operations',
        //   slug: 'profile',
        // },
      ],
    };
  }
  // getHello() {
  //   return 'Hello world';
  // }
}
