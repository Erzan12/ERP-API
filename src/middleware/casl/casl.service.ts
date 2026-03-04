import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ACTION_MAP } from 'src/utils/constants/action-map';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class CaslAbilityService {
  private Ability: AbilityClass<any>;

  constructor() {
    this.Ability = PureAbility as any;
  }

  //revamped version simplified
  defineAbilitiesFor(roles: RequestUser['roles']) {
    const { can, build } = new AbilityBuilder(this.Ability);

    for (const role of roles) {
      for (const subModule of role.sub_modules) {
        const subject = subModule.name.toLowerCase().trim();

        for (const rawAction of subModule.actions) {
          const actionsToGrant = ACTION_MAP[rawAction] ?? [rawAction];
          for (const action of actionsToGrant) {
            can(action, subject);
          }
        }
      }
    }

    return build();
  }
}
