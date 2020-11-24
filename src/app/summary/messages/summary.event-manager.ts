import { ConnectionService } from 'src/app/connection.service';
import { GameService } from 'src/app/gameService';
import { EventManager } from 'src/app/shared/messages/events-manager';
import { SummaryModel } from '../summaryModel';
import { SummaryEvent } from './response-event';

export class SummaryEventManager extends EventManager{

  private readonly SUMMARY_RESPONSE = '/user/queue/summary/summary';
  private readonly SUMMARY = '/app/summary/summary';


  constructor(connectionService: ConnectionService, gameService: GameService, private model: SummaryModel){
    super(connectionService, gameService);
  }

  public init() {
    this.subscribe(this.SUMMARY_RESPONSE, new SummaryEvent(this.model));
  }

  public sendSummary(){
    this.sendWithId(this.SUMMARY);
  }
}
