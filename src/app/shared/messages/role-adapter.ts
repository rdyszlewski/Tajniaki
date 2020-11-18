import { Role } from '../../game/models/role';

export class RoleAdapter{

  public static getRole(value: string){
    return value == 'BOSS' ? Role.BOSS : Role.PLAYER;
  }
}
