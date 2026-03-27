import { PureAbility } from '@casl/ability';
import { RequestUser } from 'src/utils/types/request-user.interface';
type Actions = string;
type Subjects = string;
export type AppAbility = PureAbility<[Actions, Subjects]>;
export declare class CaslAbilityService {
    private Ability;
    constructor();
    defineAbilitiesFor(roles: RequestUser['roles']): AppAbility;
}
export {};
