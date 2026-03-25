import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ACTION_MAP } from 'src/utils/constants/action-map';
import { RequestUser } from 'src/utils/types/request-user.interface';

type Actions = string;
type Subjects = string;

export type AppAbility = PureAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityService {
  private Ability: AbilityClass<AppAbility>;

  constructor() {
    this.Ability = PureAbility as AbilityClass<AppAbility>;
  }

  //revamped version simplified
  defineAbilitiesFor(roles: RequestUser['roles']): AppAbility {
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
