import { Role } from '../../game/models/role';

export class RoleAdapter{

  public static getRole(value: string){
    return value == 'SPYMASTER' ? Role.SPYMASTER : Role.ORDINARY_PLAYER;
  }
}
