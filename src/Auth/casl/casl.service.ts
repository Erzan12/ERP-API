import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ACTION_MAP, VALID_ACTIONS } from 'src/components/constants/action-map';

@Injectable()
export class CaslAbilityService {
  private Ability: AbilityClass<any>;

  constructor() {
    this.Ability = PureAbility as any;
  }

  //revamped version simplified
  defineAbilitiesFor(
    roles: {
      id: number;
      name: string;
      permissions: {
        action: string;
        permission: { name: string };
      }[];
    }[],
  ) {
    const { can, build } = new AbilityBuilder(this.Ability);

    // const actionMap: Record<string, string[]> = {
    //   manage: ['create', 'read', 'update', 'delete'],
    // };

    for (const role of roles) {
      if (!role.permissions) continue;

      for (const perm of role.permissions) {
        const rawAction = perm.action.toLowerCase().trim();
        const subject = perm.permission.name.toLowerCase().trim() || '';

        const actionsToGrant = ACTION_MAP[rawAction] ?? [rawAction];

        for (const action of actionsToGrant) {
          can(action, subject);
        }
      }
    }

    return build();
  }
}
