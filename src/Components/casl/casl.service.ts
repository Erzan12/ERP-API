import {
  AbilityBuilder,
  AbilityClass,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ACTION_MAP, VALID_ACTIONS } from '../constants/action-map';

@Injectable()
export class CaslAbilityService {
  private Ability: AbilityClass<any>;

  constructor() {
    this.Ability = PureAbility as any;
  }

  defineAbilitiesFor(roles: {
    id: number;
    name: string;
    permissions: {
      action: string;
      permission: { name: string };
      status: boolean;
    }[];
  }[]) {
    const { can, build } = new AbilityBuilder(this.Ability);

    const actionMap: Record<string, string[]> = {
      manage: ['create', 'read', 'update', 'delete'],
    };

    for (const role of roles) {
      if (!role.permissions) continue;

      for (const perm of role.permissions) {
        if (!perm.status) continue;

        const rawAction = perm.action.toLowerCase().trim();
        const subject = perm.permission?.name?.toLowerCase().trim() || '';

        if (
          !VALID_ACTIONS.includes(rawAction) &&
          !Object.keys(ACTION_MAP).includes(rawAction)
        ) {
          continue;
        }

        const actionsToGrant = actionMap[rawAction] ?? [rawAction];

        for (const action of actionsToGrant) {
          can(action, subject);
        }
      }
    }

    return build();
  }
}