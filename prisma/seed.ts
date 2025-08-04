//with role and role permission latest seed
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  // 1. Seed Companies
  const [abisc, abmci, svsc, lmvc] = await Promise.all(
    ['ABISC', 'ABMCI', 'SVSC', 'LMVC'].map((abbr) =>
      prisma.company.upsert({
        where: { abbreviation: abbr },
        update: {},
        create: { name: abbr, abbreviation: abbr, company_code: abbr },
      }),
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

  // 3. Create Divisions
  const assetMgmt = await prisma.division.create({
    data: { name: 'Asset Management', division_head_id: 0 },
  });

  const corpServices = await prisma.division.create({
    data: { name: 'Corporate Services', division_head_id: 0 },
  });

  // 4. Create Departments
  const hrDept = await prisma.department.create({
    data: {
      name: 'HUMAN RESOURCES DEPARTMENT',
      division_id: corpServices.id,
      department_head_id: 0,
    },
  });

  const itDept = await prisma.department.create({
    data: {
      name: 'I.T DEPARTMENT',
      division_id: assetMgmt.id,
      department_head_id: 0,
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
  const [itManager, hrManager, administrator, itStaff, hrClerk] = await Promise.all([
    prisma.position.create({
      data: {
        name: 'ADMINISTRATOR',
        department_id: itDept.id,
      },
    }),
    prisma.position.create({
      data: {
        name: 'IT MANAGER',
        department_id: itDept.id,
      },
    }),
    prisma.position.create({
      data: {
        name: 'IT STAFF',
        department_id: itDept.id,
      },
    }),
    prisma.position.create({
      data: {
        name: 'HR MANAGER',
        department_id: hrDept.id,
      },
    }),
    prisma.position.create({
      data: {
        name: 'HR CLERK',
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
      { name: 'Dashboard', module_id: managerModule.id },
      { name: 'Inbox', module_id: managerModule.id },
      { name: 'Dashboard', module_id: adminModule.id },
      { name: 'Audit Trail', module_id: adminModule.id },
      { name: 'Master Tables - Position', module_id: adminModule.id },
      { name: 'Master Tables - Department', module_id: adminModule.id },
      { name: 'Master Tables - Company', module_id: adminModule.id },
      { name: 'Master Tables - Division', module_id: adminModule.id },
      { name: 'User Account', module_id: adminModule.id },
      { name: 'User Token Keys', module_id: adminModule.id },
      
    ],
    skipDuplicates: true,
  });

  const subModules = await prisma.subModule.findMany();

  // 7. Create Permissions
  const permissions = [
    { action: 'read', sub_module_id: 1 },
    { action: 'update', sub_module_id: 1 },
    { action: 'create', sub_module_id: 1 },
    { action: 'read', sub_module_id: 2 },
    { action: 'update', sub_module_id: 2 },
    { action: 'create', sub_module_id: 2 },
    { action: 'delete', sub_module_id: 2 },
    { action: 'read', sub_module_id: 3 },
    { action: 'create', sub_module_id: 3 },
    { action: 'update', sub_module_id: 3 },
    { action: 'delete', sub_module_id: 3 },
    { action: 'read', sub_module_id: 4 },
    { action: 'update', sub_module_id: 4 },
    { action: 'create', sub_module_id: 4 },
    { action: 'read', sub_module_id: 5 },
    { action: 'create', sub_module_id: 5 },
    { action: 'update', sub_module_id: 5 },
    { action: 'delete', sub_module_id: 5 },
    { action: 'read', sub_module_id: 6 },
    { action: 'update', sub_module_id: 6 },
    { action: 'create', sub_module_id: 6 },
    { action: 'read', sub_module_id: 7 },
    { action: 'create', sub_module_id: 7 },
    { action: 'update', sub_module_id: 7 },
    { action: 'delete', sub_module_id: 7 },
    { action: 'read', sub_module_id: 8 },
    { action: 'create', sub_module_id: 8 },
    { action: 'update', sub_module_id: 8 },
    { action: 'delete', sub_module_id: 8 },
    { action: 'read', sub_module_id: 9 },
    { action: 'create', sub_module_id: 9 },
    { action: 'update', sub_module_id: 9 },
    { action: 'delete', sub_module_id: 9 },
    { action: 'read', sub_module_id: 10 },
    { action: 'create', sub_module_id: 10 },
    { action: 'update', sub_module_id: 10 },
    { action: 'delete', sub_module_id: 10 },
    { action: 'read', sub_module_id: 11 },
    { action: 'create', sub_module_id: 11 },
    { action: 'update', sub_module_id: 11 },
    { action: 'delete', sub_module_id: 11 },
    { action: 'read', sub_module_id: 12 },
    { action: 'create', sub_module_id: 12 },
    { action: 'update', sub_module_id: 12 },
    { action: 'delete', sub_module_id: 12 },
    { action: 'read', sub_module_id: 13 },
    { action: 'create', sub_module_id: 13 },
    { action: 'update', sub_module_id: 13 },
    { action: 'delete', sub_module_id: 13 },
  ];

  const permissionRecords = await Promise.all(
    permissions.map((perm) =>
      prisma.subModulePermission.create({
        data: perm,
      })
      
    )
  );

  // 8. Create Roles
  const roleNames = [
    'Administrator',
    'Human Resources',
    'Accounting',
    'Operations',
    'Payroll',
    'Inventory',
    'Purchasing',
    'Finance',
    'Asset Management',
    'Compliance',
    'Information Technology',
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

  const adminRole = roleRecords.find((r) => r.name === 'Administrator')!;
  const hrRole = roleRecords.find((r) => r.name === 'Human Resources')!;
  const itRole = roleRecords.find((r) => r.name === 'Information Technology')!;
  const manRole = roleRecords.find((r) => r.name === 'Manager')!;

  // 9. Create RolePermissions
  await prisma.rolePermission.createMany({
    data: [
      {
        role_id: hrRole.id,
        sub_module_id: permissionRecords[1].sub_module_id,
        module_id: hrModule.id,
        action: permissionRecords[1].action,
        sub_module_permission_id: permissionRecords[1].id,
      },
      {
        role_id: hrRole.id,
        sub_module_id: permissionRecords[2].sub_module_id,
        module_id: hrModule.id,
        action: permissionRecords[2].action,
        sub_module_permission_id: permissionRecords[2].id,
      },
      {
        role_id: itRole.id,
        sub_module_id: permissionRecords[3].sub_module_id,
        module_id: managerModule.id,
        action: permissionRecords[3].action,
        sub_module_permission_id: permissionRecords[3].id,
      },
      {
        role_id: itRole.id,
        sub_module_id: permissionRecords[4].sub_module_id,
        module_id: managerModule.id,
        action: permissionRecords[4].action,
        sub_module_permission_id: permissionRecords[4].id,
      },
      {
        role_id: itRole.id,
        sub_module_id: permissionRecords[5].sub_module_id,
        module_id: managerModule.id,
        action: permissionRecords[5].action,
        sub_module_permission_id: permissionRecords[5].id,
      },
      {
        role_id: adminRole.id,
        sub_module_id: permissionRecords[6].sub_module_id,
        module_id: adminModule.id,
        action: permissionRecords[6].action,
        sub_module_permission_id: permissionRecords[6].id,
      },
      {
        role_id: adminRole.id,
        sub_module_id: permissionRecords[7].sub_module_id,
        module_id: adminModule.id,
        action: permissionRecords[7].action,
        sub_module_permission_id: permissionRecords[7].id,
      },
      {
        role_id: adminRole.id,
        sub_module_id: permissionRecords[8].sub_module_id,
        module_id: adminModule.id,
        action: permissionRecords[8].action,
        sub_module_permission_id: permissionRecords[8].id,
      },
      {
        role_id: adminRole.id,
        sub_module_id: permissionRecords[9].sub_module_id,
        module_id: adminModule.id,
        action: permissionRecords[9].action,
        sub_module_permission_id: permissionRecords[9].id,
      },
      {
        role_id: adminRole.id,
        sub_module_id: permissionRecords[10].sub_module_id,
        module_id: adminModule.id,
        action: permissionRecords[10].action,
        sub_module_permission_id: permissionRecords[10].id,
      },
    ],
    skipDuplicates: true,
  });

    // Create Employement Status
  // async function main() {
    // EmploymentStatus seed
    const employmentStatuses = [
      { code: 'ACTIVE', label: 'Active' },
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
    }

  //   console.log('✅ Seeded employment statuses')
  // }

  // After upserting employment statuses
  const activeStatus = await prisma.employmentStatus.findUnique({ where: { code: 'ACTIVE' } });

  if (!activeStatus) {
    throw new Error("Active employment status not found!");
  }

  // 10. Create Employees
  const hrEmployee = await prisma.employee.create({
    data: {
      person_id: hrPerson.id,
      employee_id: 'EMP-HR-001',
      company_id: abisc.id,
      department_id: hrDept.id,
      hire_date: new Date('2023-01-01'),
      position_id: hrManager.id,
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
      employee_id: 'EMP-IT-001',
      company_id: abmci.id,
      department_id: itDept.id,
      hire_date: new Date('2022-01-01'),
      position_id: itManager.id,
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
      employee_id: 'EMP-IT-002',
      company_id: lmvc.id,
      department_id: itDept.id,
      hire_date: new Date('2025-05-12'),
      position_id: administrator.id,
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
  const hrUser = await prisma.user.create({
    data: {
      employee_id: hrEmployee.id,
      must_reset_password: false,
      username: 'hr.staff',
      email: 'hr@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: hrPerson.id,
    },
  });

  const itUser = await prisma.user.create({
    data: {
      employee_id: itEmployee.id,
      must_reset_password: false,
      username: 'it.manager',
      email: 'it@abas.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: itPerson.id,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      employee_id: adminEmployee.id,
      must_reset_password: false,
      username: 'admin',
      email: 'admin@yourdomain.com',
      password: '$2y$10$feH1XYEQwtdpy2f62ALLxugQyk0Qi9PBdr4svi5IbJn8A8Z9U7XHu',
      person_id: adminPerson.id,
    },
  });

  await prisma.userRole.createMany({
    data: [
      {
        user_id: hrUser.id,
        role_id: hrRole.id,
        module_id: hrModule.id,
        department_id: hrDept.id,
      },
      {
        user_id: hrUser.id,
        role_id: manRole.id,
        module_id: managerModule.id,
        department_id: hrDept.id,
      },
      {
        user_id: adminUser.id,
        role_id: adminRole.id,
        module_id: adminModule.id,
        department_id: itDept.id,
      },
      {
        user_id: adminUser.id,
        role_id: itRole.id,
        module_id: itModule.id,
        department_id: itDept.id,
      },
      {
        user_id: adminUser.id,
        role_id: manRole.id,
        module_id: managerModule.id,
        department_id: itDept.id,
      },
      {
        user_id: adminUser.id,
        role_id: hrRole.id,
        module_id: hrModule.id,
        department_id: hrDept.id,
      },
      {
        user_id: itUser.id,
        role_id: itRole.id,
        module_id: itModule.id,
        department_id: itDept.id,
      },
      {
        user_id: itUser.id,
        role_id: manRole.id,
        module_id: managerModule.id,
        department_id: itDept.id,
      },
    ],
  });

  // 13. Create UserRoles
  const userRoles = await prisma.userRole.createMany({
    data: [
      { user_id: hrUser.id, role_id: hrRole.id, module_id: hrDept.id, created_at: now },
      { user_id: itUser.id, role_id: itRole.id, module_id: itDept.id, created_at: now },
      { user_id: adminUser.id, role_id: adminRole.id, module_id: itDept.id, created_at: now },
    ],
  });

  const allUserRoles = await prisma.userRole.findMany();

  // 14. Create UserPermissions
  const createUserPermissions = await prisma.userPermission.createMany({
    data: [
      {
        user_id: hrUser.id,
        user_role_permission: permissionRecords[0].action,
        user_role_id: allUserRoles.find((r) => r.user_id === hrUser.id)!.id,
      },
      {
        user_id: itUser.id,
        user_role_permission: permissionRecords[6].action,
        user_role_id: allUserRoles.find((r) => r.user_id === itUser.id)!.id,
      },
    ],
  });

  // 15. Seed Password Reset Tokens
  await prisma.passwordResetToken.createMany({
    data: [
      {
        password_token: uuidv4(),
        user_id: hrUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        is_used: false,
      },
      {
        password_token: uuidv4(),
        user_id: itUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        is_used: false,
      },
      {
        password_token: uuidv4(),
        user_id: adminUser.id,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        is_used: false,
      },
    ],
  });

  // 15. Seed Password Reset Tokens
  await prisma.userToken.createMany({
    data: [
      {
        user_token: uuidv4(),
        user_id: hrUser.id,
        status: false,
      },
      {
        user_token: uuidv4(),
        user_id: itUser.id,
        status: false,
      },
      {
        user_token: uuidv4(),
        user_id: adminUser.id,
        status: false,
      },
    ],
  });

    // 16. Create a Permission Template
    const permissionTemplates = [
    {
        name: 'HR Dashboard Access',
        company_id: abisc.id,
        department_ids: [hrDept.id],
        rolePermissionIds: [
        {
            role_id: hrRole.id,
            sub_module_id: 1, // HR Dashboard
            module_id: hrModule.id,
            action: ['read', 'create','update'],
        },
        ],
    },
    {
        name: 'HR Employee Masterlist Access',
        company_id: abisc.id,
        department_ids: [hrDept.id],
        rolePermissionIds: [
        {
            role_id: hrRole.id,
            sub_module_id: 2, // Employee Masterlist
            module_id: hrModule.id,
            action: ['read', 'update', 'create', 'delete'],
        },
        ],
    },
    {
        name: 'Manager User Account Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: manRole.id,
            sub_module_id: 3, // User account (manager)
            module_id: managerModule.id,
            action: ['read', 'update', 'create', 'delete'],
        },
        ],
    },
    {
        name: 'Manager Dashboard Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: manRole.id,
            sub_module_id: 4, // Dashboard (manager)
            module_id: managerModule.id,
            action: ['read', 'update','create'],
        },
        ],
    },
    {
        name: 'Manager Inbox Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: manRole.id,
            sub_module_id: 5, // Inbox (manager)
            module_id: managerModule.id,
            action: ['read', 'update', 'create', 'delete'],
        },
        ],
    },
    {
        name: 'Admin Dashboard Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: adminRole.id,
            sub_module_id: 6, // Dashboard (admin)
            module_id: adminModule.id,
            action: ['read', 'update', 'create'],
        },
        ],
    },
    {
        name: 'Admin Audit Trail Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: adminRole.id,
            sub_module_id: 7, // Audit Trail(admin)
            module_id: adminModule.id,
            action: ['read', 'update', 'create', 'delete'],
        },
        ],
    },
    {
        name: 'Admin Master Tables - Position Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: adminRole.id,
            sub_module_id: 8, // Master Tables(admin)
            module_id: adminModule.id,
            action: ['read', 'update', 'create', 'delete'],
        },
        ],
    },
    {
        name: 'Admin Master Tables - Department Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: adminRole.id,
            sub_module_id: 9, // Master Tables(admin)
            module_id: adminModule.id,
            action: ['read', 'update', 'create', 'delete'],
        },
        ],
    },
    {
        name: 'Admin Master Tables - Company Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: adminRole.id,
            sub_module_id: 10, // Master Tables(admin)
            module_id: adminModule.id,
            action: ['read', 'update', 'create', 'delete'],
        },
        ],
    },
    {
        name: 'Admin Master Tables - Division Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: adminRole.id,
            sub_module_id: 11, // Master Tables(admin)
            module_id: adminModule.id,
            action: ['read', 'update', 'create', 'delete'],
        },
        ],
    },
    {
        name: 'Admin User Account Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: adminRole.id,
            sub_module_id: 12, // User Account(admin)
            module_id: adminModule.id,
            action: ['read', 'update', 'create', 'delete'],
        },
        ],
    },
    {
        name: 'Admin User Token Keys Access',
        company_id: abisc.id,
        department_ids: [itDept.id],
        rolePermissionIds: [
        {
            role_id: adminRole.id,
            sub_module_id: 13, // User Token Keys(admin)
            module_id: adminModule.id,
            action: ['read', 'update', 'create', 'delete'],
        },
        ],
    },
    ];

    const allRolePermissions = permissionTemplates.flatMap(template =>
        template.rolePermissionIds.flatMap(({ role_id, sub_module_id, module_id, action }) =>
            action.map(act => ({
            role_id,
            sub_module_id,
            module_id,
            action: act,
            status: true,
            }))
        )
    );

    const uniqueRolePermissions = Array.from(
        new Map(allRolePermissions.map(rp => [`${rp.role_id}-${rp.sub_module_id}-${rp.module_id}-${rp.action}`, rp]))
        .values()
    );

    await prisma.rolePermission.createMany({
        data: uniqueRolePermissions,
        skipDuplicates: true,
    });

    for (const dto of permissionTemplates) {
    // Flatten rolePermissionIds again for connecting
    const flattenedRolePermissions = dto.rolePermissionIds.flatMap(({ role_id, sub_module_id, module_id, action }) =>
        action.map(act => ({
        role_id,
        sub_module_id,
        module_id,
        action: act,
        }))
    );

    // Get unique role and module ids for connect
    const uniqueRoleIds = [...new Set(flattenedRolePermissions.map(rp => rp.role_id))];
    const uniqueModuleIds = [...new Set(flattenedRolePermissions.map(rp => rp.module_id))];

    const template = await prisma.permissionTemplate.create({
        data: {
        name: dto.name,
        company: {
            connect: { id: dto.company_id },
        },
        departments: {
            create: dto.department_ids.map(deptId => ({
            department: { connect: { id: deptId } },
            })),
        },
        role: {
            connect: uniqueRoleIds.map(id => ({ id })),
        },
        module: {
            connect: uniqueModuleIds.map(id => ({ id })),
        },
        role_permissions: {
            create: flattenedRolePermissions.map(({ role_id, sub_module_id, module_id, action }) => ({
            role_permission: {
                connect: {
                role_id_sub_module_id_module_id_action: {
                    role_id,
                    sub_module_id,
                    module_id,
                    action,
                },
                },
            },
            })),
        },
        },
    });

    console.log(`✅ Created Permission Template: ${template.name}`);
    }

    console.log('✅ Seeding completed successfully.');

}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());