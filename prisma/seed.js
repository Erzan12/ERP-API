// with role and role permission latest seed (JS version)

const { PrismaClient, Prisma } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { v4: uuidv4 } = require('uuid');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const now = new Date();

  // 1. Seed Companies
  //with full company names
  const companies = [
    { name: 'Avega Bros. Integrated Shipping Corp.', abbreviation: 'ABISC' },
    { name: 'Avega Bros. Marine Carriers, Inc.', abbreviation: 'ABMCI' },
    { name: 'Sandy Victor Shipping Corp.', abbreviation: 'SVSC' },
    { name: 'Ligaya Maritime Ventures Corp.', abbreviation: 'LMVC' },
  ];

  const [abisc, abmci, svsc, lmvc] = await Promise.all(
    companies.map(({ name, abbreviation }) =>
      prisma.company.upsert({
        where: { abbreviation },
        update: {},
        create: { name, abbreviation },
      })
    )
  );

  // 2. Seed Persons
  const hrManagerPerson = await prisma.person.create({
    data: {
      first_name: 'Jane',
      last_name: 'Doe',
      date_of_birth: new Date('1990-01-01'),
    },
  });

  const itManagerPerson = await prisma.person.create({
    data: {
      first_name: 'Alfred',
      last_name: 'Sanchez',
      date_of_birth: new Date('1985-05-01'),
    },
  });

  const hrStaffPerson = await prisma.person.create({
    data: {
      first_name: 'Amanda',
      last_name: 'Nunez',
      date_of_birth: new Date('2000-02-24')
    }
  })

  const hrClerkPerson = await prisma.person.create({
    data:{
      first_name: 'Adrian',
      last_name: 'Wazawski',
      date_of_birth: new Date('1999-05-23')
    }
  })

  const itStaffPerson = await prisma.person.create({
    data: {
      first_name: 'James',
      last_name: 'Wilson',
      date_of_birth: new Date('1995-06-02')
    }
  })

  const itClerkPerson = await prisma.person.create({
    data: {
      first_name: 'Claire',
      last_name: 'Johnson',
      date_of_birth: new Date('2001-06-27')
    }
  })

  const adminPerson = await prisma.person.create({
    data: {
      first_name: 'Earl Jan',
      last_name: 'Do',
      date_of_birth: new Date('2000-05-12'),
    },
  });

  // const superAdminPerson = await prisma.person.create({
  //   data: {
  //     first_name: 'Super Administrator',
  //     last_name: 'IT',
  //     date_of_birth: new Date('2000-05-12'),
  //   },
  // });

  // 3. Create Divisions
  const assetMgmt = await prisma.division.create({
    data: { name: 'Asset Management'},
  });

  const corpServices = await prisma.division.create({
    data: { name: 'Corporate Services'},
  });

  // 4. Create Departments
  const hrDept = await prisma.department.create({
    data: {
      name: 'hr department',
      division_id: corpServices.id,
    },
  });

  const itDept = await prisma.department.create({
    data: {
      name: 'it department',
      division_id: assetMgmt.id,
    },
  });

  const accDept = await prisma.department.create({
    data: {
      name: 'accounting department',
      division_id: assetMgmt.id,
    },
  });

  const purDept = await prisma.department.create({
    data: {
      name: 'purchasing department',
      division_id: assetMgmt.id,
    },
  });

  const wareDept = await prisma.department.create({
    data: {
      name: 'warehouse department',
      division_id: assetMgmt.id,
    },
  });

   // 5. Create Modules
  const adminModule = await prisma.module.create({
    data: {
      name: 'Administrator',
    },
  });

  const managerModule = await prisma.module.create({
    data: {
      name: 'Managers Access',
    },
  });
  
  const corpServicesModule = await prisma.module.create({
    data: {
      name: 'Corporate Services',
    },
  });

  const hrModule = await prisma.module.create({
    data: {
      name: 'Human Resources',
    },
  });

  const payrollModule = await prisma.module.create({
    data: {
      name: 'Payroll',
    },
  });

  const purchasingModule = await prisma.module.create({
    data: {
      name: 'Purchasing',
    },
  });

  const inventoryModule = await prisma.module.create({
    data: {
      name: 'Inventory',
    },
  });

  const accountingModule = await prisma.module.create({
    data: {
      name: 'Accounting',
    },
  });

  const financeModule = await prisma.module.create({
    data: {
      name: 'Finance',
    },
  });

  const markopsModule = await prisma.module.create({
    data: {
      name: 'Marketing & Operations',
    },
  });

  const assetModule = await prisma.module.create({
    data: {
      name: 'Asset Management',
    },
  });

  const complianceModule = await prisma.module.create({
    data: {
      name: 'Compliance',
    },
  });

  const itModule = await prisma.module.create({
    data: {
      name: 'IT Helpdesk',
    },
  });

  const employeeModule = await prisma.module.create({
    data: {
      name: 'Employee Dashboard',
    },
  });

  // 5. Create Positions & Match the order per position when destructuring
  const positions = await Promise.all([
    prisma.position.create({
      data: {
        name: 'it administrator',
        department_id: itDept.id,
      },
    }),

    prisma.position.create({
      data: {
        name: 'it manager',
        department_id: itDept.id,
      },
    }),

    prisma.position.create({
      data: {
        name: 'it staff',
        department_id: itDept.id,
      },
    }),

    prisma.position.create({
      data: {
        name: 'it clerk',
        department_id: itDept.id,
      },
    }),

    prisma.position.create({
      data: {
        name: 'hr manager',
        department_id: hrDept.id,
      },
    }),

    prisma.position.create({
      data: {
        name: 'hr clerk',
        department_id: hrDept.id,
      },
    }),

    prisma.position.create({
      data: {
        name: 'hr staff',
        department_id: hrDept.id,
      },
    }),
  ]);

  const [
    itAdministrator,
    itManager,
    itStaff,
    itClerk,
    hrManager,
    hrClerk,
    hrStaff,
  ] = positions;

  const subModulesData = [
    { name: 'Dashboard', module_id: hrModule.id },
    { name: 'Employee Masterlist', module_id: hrModule.id },
    { name: 'Career Posting', module_id: hrModule.id },
    { name: 'Hiring Pipeline', module_id: hrModule.id },
    { name: 'Regularization Review', module_id: hrModule.id },
    { name: 'Performance Competency', module_id: hrModule.id },
    { name: 'Leave Category', module_id: hrModule.id },
    { name: 'Leave Cases', module_id: hrModule.id },
    { name: 'Extended Leave Cases', module_id: hrModule.id },
    { name: 'Performance Evaluation', module_id: employeeModule.id },
    { name: 'User Account', module_id: managerModule.id },
    { name: 'Permission Template', module_id: managerModule.id },
    { name: 'Dashboard', module_id: managerModule.id },
    { name: 'Inbox', module_id: managerModule.id },
    { name: 'Dashboard', module_id: adminModule.id },
    { name: 'Audit Trail', module_id: adminModule.id },
    { name: 'Mastertables', module_id: adminModule.id },
    { name: 'User Token Keys', module_id: adminModule.id },
    { name: 'System Management', module_id: adminModule.id },
    { name: 'DB Query', module_id: adminModule.id },
  ];

  await prisma.subModule.createMany({
    data: subModulesData.map(subModule => ({
      ...subModule,
      slug: subModule.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, ''),
    })),
    skipDuplicates: true,
  });

  const subModules = await prisma.subModule.findMany();

  // 6.5 Create Permissions for submodules
  const defaultActions = ['create', 'read', 'update', 'delete', 'note', 'verify', 'approve', 'evaluate', 'submit', 'acknowledge', 'reject', 'cancel', 'process', 'return', 'escalate', 'reopen', 'hold', 'screen', 'shortlist', 'set_interview', 'accept', 'onboard'];

  const resultAction = await prisma.subModuleAction.createMany({
    data: defaultActions.map(action => ({
      action,
      slug: action
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, ''),
      is_active: true,
    })),
    skipDuplicates: true,
  });

  console.log(resultAction);

  const subModuleActions = await prisma.subModuleAction.findMany();

  //const subModulePermissionsData = [];
  const subModulePermissionsData = [];

  for (const subModule of subModules) {
    for (const action of subModuleActions) {
      subModulePermissionsData.push({
        sub_module_id: subModule.id,
        sub_module_action_id: action.id, // ✅ this is what Prisma needs
        code: `${subModule.slug}.${action.slug}`,
        action: action.action, // optional, but useful for filtering
      });
    }
  }

  await prisma.subModulePermission.createMany({
    data: subModulePermissionsData,
    skipDuplicates: true,
  });


  console.log(`✅ Seeded ${subModulePermissionsData.length} SubModulePermissions`);
  
  // 8. Create Roles
  const roleNames = [
    'Super Administrator',
    'Administrator',
    'IT Staff',
    'IT Manager',
    'IT Clerk',
    'Network Manager',
    'Jr. Systems Developer',
    'Sr. Systems Developer',
    'HR Clerk',
    'HR Staff',
    'HR Manager',
    'Supervisor',
    'Guest',
    'Staff',
    'Executive',
    'Eportal User',
    'Manager'
  ];

  const roleRecords = await Promise.all(
    roleNames.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} role` },
      }),
    )
  );

  const superAdminRole = roleRecords.find((r) => r.name === 'Super Administrator');
  const adminRole = roleRecords.find((r) => r.name === 'Administrator');
  const itStaffRole = roleRecords.find((r) => r.name === 'IT Staff');
  const itClerkRole = roleRecords.find((r) => r.name === 'IT Clerk');
  const hrManagerRole = roleRecords.find((r) => r.name === 'HR Manager');
  const hrClerkRole = roleRecords.find((r) => r.name === 'HR Clerk');
  const hrStaffRole = roleRecords.find((r) => r.name === 'HR Staff');

  // Create Employement Status
  // async function main() {
  // EmploymentStatus seed
  const employmentStatuses = [
    { code: 'REGULAR', label: 'Regular' },
    { code: 'ON_LEAVE', label: 'On Leave' },
    { code: 'TERMINATED', label: 'Terminated' },
    { code: 'RESIGNED', label: 'Resigned' },
    { code: 'PROBATIONARY', label: 'Probationary' },
  ]

  for (const status of employmentStatuses) {
    await prisma.employmentStatus.upsert({
      where: { code: status.code },
      update: {},
      create: status,
    })
    console.log('✅ Seeded employment statuses')
  }

  // After upserting employment statuses
  const activeRegularStatus = await prisma.employmentStatus.findUnique({ where: { code: 'REGULAR' } });
  const activeProbiStatus = await prisma.employmentStatus.findUnique({ where: { code: 'PROBATIONARY' } });

  if (!activeRegularStatus) {
    throw new Error("Active employment status not found!");
  }

  if (!activeProbiStatus) {
    throw new Error("Active employment status not found!");
  }

  // 10. Create Employees

  const superAdminEmployee = await prisma.employee.create({
    data: {
      person_id: itStaffPerson.id,
      employee_id: 'EMP-IT-001',
      company_id: abisc.id,
      department_id: itDept.id,
      hire_date: new Date('2026-01-02'),
      position_id: itStaff.id,
      division_id: assetMgmt.id,
      salary: 20000,
      pay_frequency: 'Monthly',
      employment_status_id: activeProbiStatus.id,
      monthly_equivalent_salary: 60000,
      corporate_rank_id: 1,
    },
  });
  
  const hrManagerEmployee = await prisma.employee.create({
    data: {
      person_id: hrManagerPerson.id,
      employee_id: 'EMP-HR-001',
      company_id: abisc.id,
      department_id: hrDept.id,
      hire_date: new Date('2023-02-20'),
      position_id: hrManager.id,
      division_id: corpServices.id,
      salary: 30000,
      pay_frequency: 'Monthly',
      employment_status_id: activeRegularStatus.id,
      monthly_equivalent_salary: 30000,
      corporate_rank_id: 2,
    },
  });

  const itManagerEmployee = await prisma.employee.create({
    data: {
      person_id: itManagerPerson.id,
      employee_id: 'EMP-IT-002',
      company_id: abisc.id,
      department_id: itDept.id,
      hire_date: new Date('2026-01-05'),
      position_id: itManager.id,
      division_id: assetMgmt.id,
      salary: 60000,
      pay_frequency: 'Monthly',
      employment_status_id: activeProbiStatus.id,
      monthly_equivalent_salary: 60000,
      corporate_rank_id: 1,
    },
  });

  const adminEmployee = await prisma.employee.create({
    data: {
      person_id: adminPerson.id,
      employee_id: 'EMP-IT-003',
      company_id: abisc.id,
      department_id: itDept.id,
      hire_date: new Date('2025-05-12'),
      position_id: itAdministrator.id,
      division_id: assetMgmt.id,
      salary: 20000,
      pay_frequency: 'Monthly',
      employment_status_id: activeRegularStatus.id,
      monthly_equivalent_salary: 60000,
      corporate_rank_id: 1,
    },
  });

  const hrStaffEmployee = await prisma.employee.create({
    data: {
      person_id: hrStaffPerson.id,
      employee_id: 'EMP-HR-002',
      company_id: abisc.id,
      department_id: hrDept.id,
      hire_date: new Date('2026-04-20'),
      position_id: hrStaff.id,
      division_id: corpServices.id,
      salary: 20000,
      pay_frequency: 'Monthly',
      employment_status_id: activeRegularStatus.id,
      monthly_equivalent_salary: 20000,
      corporate_rank_id: 2,
    },
  });

  const hrClerkEmployee = await prisma.employee.create({
    data: {
      person_id: hrClerkPerson.id,
      employee_id: 'EMP-HR-003',
      company_id: abisc.id,
      department_id: hrDept.id,
      hire_date: new Date('2026-03-20'),
      position_id: hrClerk.id,
      division_id: corpServices.id,
      salary: 15000,
      pay_frequency: 'Monthly',
      employment_status_id: activeRegularStatus.id,
      monthly_equivalent_salary: 15000,
      corporate_rank_id: 2,
    },
  });

  const itClerkEmployee = await prisma.employee.create({
    data: {
      person_id: itClerkPerson.id,
      employee_id: 'EMP-IT-004',
      company_id: abisc.id,
      department_id: itDept.id,
      hire_date: new Date('2026-02-15'),
      position_id: itClerk.id,
      division_id: corpServices.id,
      salary: 20000,
      pay_frequency: 'Monthly',
      employment_status_id: activeRegularStatus.id,
      monthly_equivalent_salary: 20000,
      corporate_rank_id: 2,
    },
  });

  // 11. Update division/department heads
  await prisma.division.update({ where: { id: assetMgmt.id }, data: { division_head_id: itManagerEmployee.id } });
  await prisma.division.update({ where: { id: corpServices.id }, data: { division_head_id: hrManagerEmployee.id } });
  await prisma.department.update({ where: { id: itDept.id }, data: { department_head_id: itManagerEmployee.id } });
  await prisma.department.update({ where: { id: hrDept.id }, data: { department_head_id: hrManagerEmployee.id } });

  // 12. Create Users
  const superAdminUser = await prisma.user.create({
    data: {
      employee_id: superAdminEmployee.id,
      username: 'james_wilson',
      email: 'superadmin@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: itStaffPerson.id,
      require_reset: 0,
      security_clearance_level: 9
    }
  })

  const adminUser = await prisma.user.create({
    data: {
      employee_id: adminEmployee.id,
      username: 'admin',
      email: 'admin@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: adminPerson.id,
      require_reset: 0,
      security_clearance_level: 7
    },
  });

  const hrManagerUser = await prisma.user.create({
    data: {
      employee_id: hrManagerEmployee.id,
      username: 'hr.manager',
      email: 'hrmanager@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: hrManagerPerson.id,
      require_reset: 0,
      security_clearance_level: 5
    },
  });

  const itManagerUser = await prisma.user.create({
    data: {
      employee_id: itManagerEmployee.id,
      username: 'it.manager',
      email: 'itmanager@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: itManagerPerson.id,
      require_reset: 0,
      security_clearance_level: 5
    },
  });

  const hrStaffUser = await prisma.user.create({
    data: {
      employee_id: hrStaffEmployee.id,
      username: 'hr.staff',
      email: 'hrstaff@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: hrStaffPerson.id,
      require_reset: 0,
      security_clearance_level: 5
    },
  });

  const hrClerkUser = await prisma.user.create({
    data: {
      employee_id: hrClerkEmployee.id,
      username: 'hr.clerk',
      email: 'hrclerk@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: hrClerkPerson.id,
      require_reset: 0,
      security_clearance_level: 5
    },
  });

  const itClerkUser = await prisma.user.create({
    data: {
      employee_id: itClerkEmployee.id,
      username: 'it.clerk',
      email: 'itclerk@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: itClerkPerson.id,
      require_reset: 0,
      security_clearance_level: 5
    },
  });

  // Assuming you have:
  const userId = adminUser.id; // your user ID
  const roleId = adminRole.id; // admin role ID

  // for super admin
  const superUserId = superAdminUser.id;
  const superRoleId = superAdminRole.id;

  // for hr manager 
  const hrManagerUserId = hrManagerUser.id;
  const hrManagerRoleId = hrManagerRole.id;

  // for hr staff 
  const hrStaffUserId = hrStaffUser.id;
  const hrStaffRoleId = hrStaffRole.id;

  /// for hr clear
  const hrClerkUserId = hrClerkUser.id;
  const hrClerkRoleId = hrClerkRole.id;

    // Create UserRole linking user to role
  const userRole = await prisma.userRole.create({
    data: {
      user_id: userId,
      role_id: roleId,
      role_name: 'Administrator',
    },
  });

  const superUserRole = await prisma.userRole.create({
    data: {
      user_id: superUserId,
      role_id: superRoleId,
      role_name: 'Super Administrator',
    }
  })

  const hrManRole = await prisma.userRole.create({
    data: {
      user_id: hrManagerUserId,
      role_id: hrManagerRoleId,
      role_name: 'HR Manager',
    }
  })

  const hrClrkRole = await prisma.userRole.create({
    data: {
      user_id: hrClerkUserId,
      role_id: hrClerkRoleId,
      role_name: 'HR Clerk',
    }
  })

  const hrStffRole = await prisma.userRole.create({
    data: {
      user_id: hrStaffUserId,
      role_id: hrStaffRoleId,
      role_name: 'HR Staff',
    }
  })

  // list of submodules
  const dashboardOnly = ['Dashboard'];
  const hrModules = ['Career Posting', 'Hiring Pipeline', 'Regularization Review', 'Performance Competency', 'Leave Category', 'Extended Leave Cases', 'Performance Evaluation']
  const fullAccess = ['Employee Masterlist', 'User Account', 'Inbox', 'Audit Trail', 'Mastertables', 'User Token Keys', 'System Management'];

  // list of actions/permissions
  const dashboardActions = ['read']; // or ['view'] depending on your SubModuleAction
  const fullActions = ['create', 'read', 'update', 'delete', 'note', 'verify', 'approve', 'evaluate', 'submit', 'acknowledge', 'reject', 'cancel', 'process', 'return', 'escalate', 'reopen', 'hold', 'screen', 'shortlist', 'set_interview', 'accept', 'onboard'];

  const allSubModules = await prisma.subModule.findMany();
  const allSubModulePermissions = await prisma.subModulePermission.findMany();
  const allSubModuleActions = await prisma.subModuleAction.findMany();

  const subModuleActionMap = new Map(
    allSubModuleActions.map(action => [action.action, action.id])
  );

  // Map of subModulePermission: { action, sub_module_id, id }
  const subModulePermissionMap = new Map();
  for (const perm of allSubModulePermissions) {
    subModulePermissionMap.set(`${perm.sub_module_id}-${perm.action}`, perm.id);
  }

  const rolePermissionPayload = [];

  for (const sub of allSubModules) {
    const isDashboard = dashboardOnly.includes(sub.name);
    // const isHRIS = fullActions.includes(sub.name)
    const actionsToAssign = isDashboard ? dashboardActions : fullActions;
    // const HRISactionsToAssign = isHRIS;

    for (const action of actionsToAssign) {
      const subModulePermissionId = subModulePermissionMap.get(`${sub.id}-${action}`);
      if (!subModulePermissionId) continue; // skip if permission not found

      // const department_id_uuid = uuidv4();

      rolePermissionPayload.push({
        // action,
        role_id: superAdminRole.id,
        // role_name: superAdminRole.name,
        sub_module_permission_id: subModulePermissionId,
        // department_id:  itDept.id
      });

      rolePermissionPayload.push({
        // action,
        role_id: adminRole.id,
        // role_name: adminRole.name,
        sub_module_permission_id: subModulePermissionId,
        // department_id:  itDept.id
      });

      rolePermissionPayload.push({
        // action,
        role_id: hrManagerRole.id,
        // role_name: hrManagerRole.name,
        sub_module_permission_id: subModulePermissionId,
        // department_id:  hrDept.id
      });

      rolePermissionPayload.push({
        // action,
        role_id: hrClerkRole.id,
        // role_name: hrClerkRole.name,
        sub_module_permission_id: subModulePermissionId,
        // department_id:  hrDept.id
      });

      rolePermissionPayload.push({
        // action,
        role_id: hrStaffRole.id,
        // role_name: hrStaffRole.name,
        sub_module_permission_id: subModulePermissionId,
        // department_id:  hrDept.id
      });
    }
  }

  if (rolePermissionPayload.length > 0) {
    await prisma.rolePermission.createMany({
      data: rolePermissionPayload,
      skipDuplicates: true,
    });
  }
  // console.log(`✅ Super Administrator and Administrator role permissions created for ${rolePermissionPayload.length} actions.`);

  // Fetch all RolePermissions for the role
  const rolePermissions = await prisma.rolePermission.findMany({
    where: {
      role_id: roleId,
    },
    include: {
      sub_module_permission: {
        select: {
          id: true,
          action: true,
        }
      }
    }
  });

  const superUserPermissionsData = rolePermissions.map((rp) => ({
    action: rp.sub_module_permission.action,
    user_id: superUserId,
    user_role_id: superUserRole.id,
    role_permission_id: rp.id,
  }));

  // Create UserPermissions for this userRole
  const userPermissionsData = rolePermissions.map((rp) => ({
    action: rp.sub_module_permission.action,
    user_id: userId,
    user_role_id: userRole.id,
    role_permission_id: rp.id,
  }));

  const hrManagerPermissionsData = rolePermissions.map((rp) => ({
    action: rp.sub_module_permission.action,
    user_id: hrManagerUserId,
    user_role_id: hrManRole.id,
    role_permission_id: rp.id,
  }));

  const hrClerkPermissionsData = rolePermissions.map((rp) => ({
    action: rp.sub_module_permission.action,
    user_id: hrClerkUserId,
    user_role_id: hrClrkRole.id,
    role_permission_id: rp.id,
  }));

  const hrStaffPermissionsData = rolePermissions.map((rp) => ({
    action: rp.sub_module_permission.action,
    user_id: hrStaffUserId,
    user_role_id: hrStffRole.id,
    role_permission_id: rp.id,
  }));

  // console.log('Role Permissions Count:', rolePermissions.length);
  // console.log(rolePermissions);

  const result = await prisma.userPermission.createMany({
    data: userPermissionsData,
    skipDuplicates: true, // avoid duplicates on rerun
  });

  console.log(result);

  await prisma.userPermission.createMany({
    data: superUserPermissionsData,
    skipDuplicates: true, // avoid duplicates on rerun
  })

  await prisma.userPermission.createMany({
    data: hrManagerPermissionsData,
    skipDuplicates: true, // avoid duplicates on rerun
  })

  await prisma.userPermission.createMany({
    data: hrClerkPermissionsData,
    skipDuplicates: true, // avoid duplicates on rerun
  })

  await prisma.userPermission.createMany({
    data: hrStaffPermissionsData,
    skipDuplicates: true, // avoid duplicates on rerun
  })

  // console.log(`✅ Assigned ${userPermissionsData.length} permissions to user ${userId}`);
  // console.log(`✅ Assigned ${superUserPermissionsData.length} permissions to Super user ${userId}`);

  // i also want to add role permission for the admin user the role permission is a role like Administrator and assigned to a existing submodulepermission

  // 15. Seed Password Reset Tokens
  await prisma.passwordResetToken.createMany({
    data: [
      {
        password_token: uuidv4(),
        user_id: hrManagerUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: true,
      },
      {
        password_token: uuidv4(),
        user_id: itManagerUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: true,
      },
      {
        password_token: uuidv4(),
        user_id: adminUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: true,
      },
      {
        password_token: uuidv4(),
        user_id: superAdminUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: true,
      },
      {
        password_token: uuidv4(),
        user_id: hrStaffUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: true,
      },
      {
        password_token: uuidv4(),
        user_id: hrClerkUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: true,
      },
      // {
      //   password_token: uuidv4(),
      //   user_id: itStaffUser.id,
      //   expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
      //   isUsed: true,
      // },
      {
        password_token: uuidv4(),
        user_id: itClerkUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: true,
      },
    ],
  });

  // 15. Seed Password Reset Tokens
  await prisma.userToken.createMany({
    data: [
      {
        user_token: uuidv4(),
        user_id: hrManagerUser.id,
        isUsed: true,
      },
      {
        user_token: uuidv4(),
        user_id: itManagerUser.id,
        isUsed: true,
      },
      {
        user_token: uuidv4(),
        user_id: adminUser.id,
        isUsed: true,
      },
      {
        user_token: uuidv4(),
        user_id: superAdminUser.id,
        isUsed: true,
      },
      {
        user_token: uuidv4(),
        user_id: hrStaffUser.id,
        isUsed: true,
      },
      {
        user_token: uuidv4(),
        user_id: hrClerkUser.id,
        isUsed: true,
      },
      // {
      //   user_token: uuidv4(),
      //   user_id: itSta.id,
      //   isUsed: true,
      // },
      {
        user_token: uuidv4(),
        user_id: itClerkUser.id,
        isUsed: true,
      },
    ],
  });
  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());