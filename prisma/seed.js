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
  const hrPerson = await prisma.person.create({
    data: {
      first_name: 'Jane',
      last_name: 'Doe',
      date_of_birth: new Date('1990-01-01'),
    },
  });

  const itPerson = await prisma.person.create({
    data: {
      first_name: 'Alfred',
      last_name: 'Sanchez',
      date_of_birth: new Date('1985-05-01'),
    },
  });

  const adminPerson = await prisma.person.create({
    data: {
      first_name: 'Earl Jan',
      last_name: 'Do',
      date_of_birth: new Date('2000-05-12'),
    },
  });

  const superAdminPerson = await prisma.person.create({
    data: {
      first_name: 'Super Administrator',
      last_name: 'IT',
      date_of_birth: new Date('2000-05-12'),
    },
  });

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

    // 5. Create Positions
  const [itManager, hrManager, itStaff, hrClerk] = await Promise.all([
    // prisma.position.create({
    //   data: {
    //     name: 'administrator',
    //     department_id: itDept.id,
    //   },
    // }),

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
  ]);

  // 6. Create SubModules
  await prisma.subModule.createMany({
    data: [
      { name: 'Dashboard', module_id: hrModule.id },
      { name: 'Employee Masterlist', module_id: hrModule.id },
      { name: 'User Account', module_id: managerModule.id },
      { name: 'Permission Template', module_id: managerModule.id},
      { name: 'Dashboard', module_id: managerModule.id },
      { name: 'Inbox', module_id: managerModule.id },
      { name: 'Dashboard', module_id: adminModule.id },
      { name: 'Audit Trail', module_id: adminModule.id },
      { name: 'Mastertables', module_id: adminModule.id },
      { name: 'User Token Keys', module_id: adminModule.id },
      { name: 'System Management', module_id: adminModule.id },
      { name: 'DB Query', module_id: adminModule.id}
    ],
    skipDuplicates: true,
  });

  const subModules = await prisma.subModule.findMany();

  // 6.5 Create Permissions for submodules
  const defaultActions = ['create', 'read', 'update', 'delete', 'note', 'verify', 'approve'];

  await prisma.subModuleAction.createMany({
    data: defaultActions.map(action => ({ action, is_active: true })),
    skipDuplicates: true,
  });

  const subModuleActions = await prisma.subModuleAction.findMany();

  //const subModulePermissionsData = [];
  const subModulePermissionsData = [];

  for (const subModule of subModules) {
    for (const action of subModuleActions) {
      subModulePermissionsData.push({
        sub_module_id: subModule.id,
        sub_module_action_id: action.id, // ✅ this is what Prisma needs
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
    'Supervisor',
    'Guest',
    'Staff',
    'Executive',
    'HR Clerk',
    'HR Staff',
    'Network Manager',
    'Jr. Systems Developer',
    'Sr. Systems Developer',
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
  const hrRole = roleRecords.find((r) => r.name === 'HR Clerk');
  const itRole = roleRecords.find((r) => r.name === 'IT Staff');
  const manRole = roleRecords.find((r) => r.name === 'Manager');

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
  const activeStatus = await prisma.employmentStatus.findUnique({ where: { code: 'REGULAR' } });

  if (!activeStatus) {
    throw new Error("Active employment status not found!");
  }

  // 10. Create Employees

  const superAdminEmployee = await prisma.employee.create({
    data: {
      person_id: superAdminPerson.id,
      employee_id: 'EMP-IT-001',
      company_id: abisc.id,
      department_id: itDept.id,
      hire_date: new Date('2025-05-12'),
      position_id: itStaff.id,
      division_id: assetMgmt.id,
      salary: 20000,
      pay_frequency: 'Monthly',
      employment_status_id: activeStatus.id,
      monthly_equivalent_salary: 60000,
      corporate_rank_id: 1,
    },
  });
  
  const hrEmployee = await prisma.employee.create({
    data: {
      person_id: hrPerson.id,
      employee_id: 'EMP-HR-001',
      company_id: abisc.id,
      department_id: hrDept.id,
      hire_date: new Date('2023-02-20'),
      position_id: hrManager.id,
      division_id: corpServices.id,
      salary: 30000,
      pay_frequency: 'Monthly',
      employment_status_id: activeStatus.id,
      monthly_equivalent_salary: 30000,
      corporate_rank_id: 2,
    },
  });

  const itEmployee = await prisma.employee.create({
    data: {
      person_id: itPerson.id,
      employee_id: 'EMP-IT-002',
      company_id: abisc.id,
      department_id: itDept.id,
      hire_date: new Date('2022-01-01'),
      position_id: itManager.id,
      division_id: assetMgmt.id,
      salary: 60000,
      pay_frequency: 'Monthly',
      employment_status_id: activeStatus.id,
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
      position_id: itStaff.id,
      division_id: assetMgmt.id,
      salary: 20000,
      pay_frequency: 'Monthly',
      employment_status_id: activeStatus.id,
      monthly_equivalent_salary: 60000,
      corporate_rank_id: 1,
    },
  });

  // 11. Update division/department heads
  await prisma.division.update({ where: { id: assetMgmt.id }, data: { division_head_id: itEmployee.id } });
  await prisma.division.update({ where: { id: corpServices.id }, data: { division_head_id: hrEmployee.id } });
  await prisma.department.update({ where: { id: itDept.id }, data: { department_head_id: itEmployee.id } });
  await prisma.department.update({ where: { id: hrDept.id }, data: { department_head_id: hrEmployee.id } });

  // 12. Create Users
  const superAdminUser = await prisma.user.create({
    data: {
      employee_id: superAdminEmployee.id,
      username: 'superadmin',
      email: 'superadmin@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: superAdminPerson.id,
      require_reset: 0,
      security_clearance_level: 9
    }
  })

  const adminUser = await prisma.user.create({
    data: {
      employee_id: adminEmployee.id,
      username: 'admin',
      email: 'admin@yourdomain.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: adminPerson.id,
      require_reset: 0,
      security_clearance_level: 7
    },
  });

  const hrUser = await prisma.user.create({
    data: {
      employee_id: hrEmployee.id,
      username: 'hr.staff',
      email: 'hr@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: hrPerson.id,
      require_reset: 0,
      security_clearance_level: 5
    },
    
  });

  const itUser = await prisma.user.create({
    data: {
      employee_id: itEmployee.id,
      username: 'it.manager',
      email: 'it@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: itPerson.id,
      require_reset: 0,
      security_clearance_level: 5
    },
  });

  // list of submodules
  const dashboardOnly = ['Dashboard'];
  const fullAccess = ['Employee Masterlist', 'User Account', 'Inbox', 'Audit Trail', 'Mastertables', 'User Token Keys', 'System Management'];

  // list of actions/permissions
  const dashboardActions = ['read']; // or ['view'] depending on your SubModuleAction
  const fullActions = ['create', 'read', 'update', 'delete'];

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
    const actionsToAssign = isDashboard ? dashboardActions : fullActions;

    for (const action of actionsToAssign) {
      const subModulePermissionId = subModulePermissionMap.get(`${sub.id}-${action}`);
      if (!subModulePermissionId) continue; // skip if permission not found

      // const department_id_uuid = uuidv4();

      rolePermissionPayload.push({
        action,
        sub_module_id: sub.id,
        role_id: superAdminRole.id,
        role_name: superAdminRole.name,
        sub_module_permission_id: subModulePermissionId,
        department_id:  itDept.id
      });

      rolePermissionPayload.push({
        action,
        sub_module_id: sub.id,
        role_id: adminRole.id,
        role_name: adminRole.name,
        sub_module_permission_id: subModulePermissionId,
        department_id:  itDept.id
      });
    }
  }

  if (rolePermissionPayload.length > 0) {
    await prisma.rolePermission.createMany({
      data: rolePermissionPayload,
      skipDuplicates: true,
    });
  }
  console.log(`✅ Super Administrator and Administrator role permissions created for ${rolePermissionPayload.length} actions.`);
  // i also want to add role permission for the admin user the role permission is a role like Administrator and assigned to a existing submodulepermission

  // Assuming you have:
  const userId = adminUser.id; // your user ID
  const roleId = adminRole.id; // admin role ID

  //for super admin
  const superUserId = superAdminUser.id;
  const superRoleId = superAdminRole.id;

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

  // Fetch all RolePermissions for the role
  const rolePermissions = await prisma.rolePermission.findMany({
    where: {
      role_id: roleId,
    },
  });

  const superUserPermissionsData = rolePermissions.map((rp) => ({
    action: rp.action,
    user_id: superUserId,
    user_role_id: superUserRole.id,
    role_permission_id: rp.id,
  }));

  // Create UserPermissions for this userRole
  const userPermissionsData = rolePermissions.map((rp) => ({
    action: rp.action,
    user_id: userId,
    user_role_id: userRole.id,
    role_permission_id: rp.id,
  }));

  await prisma.userPermission.createMany({
    data: userPermissionsData,
    skipDuplicates: true, // avoid duplicates on rerun
  });

  await prisma.userPermission.createMany({
    data: superUserPermissionsData,
    skipDuplicates: true, // avoid duplicates on rerun
  })

  console.log(`✅ Assigned ${userPermissionsData.length} permissions to user ${userId}`);
  console.log(`✅ Assigned ${superUserPermissionsData.length} permissions to Super user ${userId}`);

  // 15. Seed Password Reset Tokens
  await prisma.passwordResetToken.createMany({
    data: [
      {
        password_token: uuidv4(),
        user_id: hrUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: false,
      },
      {
        password_token: uuidv4(),
        user_id: itUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: false,
      },
      {
        password_token: uuidv4(),
        user_id: adminUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: false,
      },
      {
        password_token: uuidv4(),
        user_id: superAdminUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        isUsed: false,
      },
    ],
  });

  // 15. Seed Password Reset Tokens
  await prisma.userToken.createMany({
    data: [
      {
        user_token: uuidv4(),
        user_id: hrUser.id,
        isUsed: false,
      },
      {
        user_token: uuidv4(),
        user_id: itUser.id,
        isUsed: false,
      },
      {
        user_token: uuidv4(),
        user_id: adminUser.id,
        isUsed: false,
      },
      {
        user_token: uuidv4(),
        user_id: superAdminUser.id,
        isUsed: false,
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