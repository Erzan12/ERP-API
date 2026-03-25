import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateAdminUserAccess() {
  const adminUser = await prisma.user.findFirst({
    where: { username: 'admin' },
    include: {
      user_roles: true,
    },
  });

  if (!adminUser) {
    console.error('❌ Admin user not found.');
    return;
  }

  const adminRole = await prisma.role.findFirst({
    where: { name: 'Administrator' },
    include: {
      role_permissions: true,
    },
  });

  if (!adminRole) {
    console.error('❌ Administrator role not found.');
    return;
  }

  const subModules = await prisma.subModule.findMany();
  const subModulePermissions = await prisma.subModulePermission.findMany();
  const subModuleActions = await prisma.subModuleAction.findMany();

  const dashboardOnly = ['Dashboard'];
  const fullAccess = [
    'Employee Masterlist',
    'User Account',
    'Inbox',
    'Audit Trail',
    'Mastertables',
    'User Token Keys',
    'System Management',
  ];

  const expectedPermissions: {
    sub_module_id: string;
    action: string;
  }[] = [];

  for (const sub of subModules) {
    const actions = dashboardOnly.includes(sub.name)
      ? ['read']
      : fullAccess.includes(sub.name)
      ? ['create', 'read', 'update', 'delete']
      : [];

    actions.forEach(action => {
      expectedPermissions.push({
        sub_module_id: sub.id,
        action,
      });
    });
  }

  const actualPermissions = adminRole.role_permissions.map(p => ({
    sub_module_id: p.sub_module_id,
    action: p.action,
  }));

  const missingPermissions = expectedPermissions.filter(expected => {
    return !actualPermissions.some(
      actual =>
        actual.sub_module_id === expected.sub_module_id &&
        actual.action === expected.action
    );
  });

  if (missingPermissions.length === 0) {
    console.log('✅ Administrator role has all expected submodule permissions.');
  } else {
    console.warn(`⚠️ Missing ${missingPermissions.length} permissions for Administrator role:`);
    for (const miss of missingPermissions) {
      const sub = subModules.find(s => s.id === miss.sub_module_id);
      console.log(`  - ${sub?.name} → ${miss.action}`);
    }
  }

  const modulesWithAdminRole = new Set(
    adminRole.role_permissions.map(p => p.sub_module_id)
  );

//   const userRoleModules = new Set(adminUser.user_roles.map(r => r.sub_module));

//   if (userRoleModules.size === 0) {
//     console.error('❌ Admin user has no roles assigned.');
//   } else {
//     console.log(`✅ Admin user is assigned to ${userRoleModules.size} modules.`);
//   }

  console.log('🔍 Validation complete.');
}

validateAdminUserAccess()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
