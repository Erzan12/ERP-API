"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaslAbilityService = void 0;
const ability_1 = require("@casl/ability");
const common_1 = require("@nestjs/common");
const action_map_1 = require("../../utils/constants/action-map");
let CaslAbilityService = class CaslAbilityService {
    Ability;
    constructor() {
        this.Ability = ability_1.PureAbility;
    }
    defineAbilitiesFor(roles) {
        const { can, build } = new ability_1.AbilityBuilder(this.Ability);
        for (const role of roles) {
            for (const subModule of role.sub_modules) {
                const subject = subModule.name.toLowerCase().trim();
                for (const rawAction of subModule.actions) {
                    const actionsToGrant = action_map_1.ACTION_MAP[rawAction] ?? [rawAction];
                    for (const action of actionsToGrant) {
                        can(action, subject);
                    }
                }
            }
        }
        return build();
    }
};
exports.CaslAbilityService = CaslAbilityService;
exports.CaslAbilityService = CaslAbilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CaslAbilityService);
//# sourceMappingURL=casl.service.js.map