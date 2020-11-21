import { ConnectionService } from 'src/app/connection.service';
import { GameService } from 'src/app/gameService';
import { ConnectionPath } from 'src/app/shared/connectionPath';
import { EventManager } from 'src/app/shared/messages/events-manager';
import { SummaryModel } from '../summaryModel';
import { SummaryEvent } from './response-event';

export class SummaryEventManager extends EventManager{

  // TODO: sprawdzić , czy to będzie działać 
  constructor(connectionService: ConnectionService, gameService: GameService, private model: SummaryModel){
    super(connectionService, gameService);
  }

  public init() {
    this.subscribe(ConnectionPath.SUMMARY_RESPONSE, new SummaryEvent(this.model));
  }

  public sendSummary(){
    this.sendWithId(ConnectionPath.SUMMARY);
  }
}
