import { VotingModel } from '../votingModel';
import { ConnectionService } from '../../connection.service';
import { ConnectionPath } from '../../shared/connectionPath';
import { VotingPlayer } from '../voting_player';
import { GameService } from '../../gameService';
import { EventManager} from 'src/app/shared/messages/events-manager';
import { EndVotingEvent, StartTimerEvent, TimerEvent, VoteEvent, VotingDisconnectEvent } from './response-event';
import { IStateEvent } from 'src/app/shared/change-state';
import { DialogMode } from 'src/app/widgets/dialog/dialogMode';
import { DialogComponent } from 'src/app/widgets/dialog/dialog.component';
import { DialogService } from 'src/app/widgets/dialog/dialog.service';

export class VotingEventManager extends EventManager{

    constructor( connectionService: ConnectionService, gameService: GameService,
      private model:VotingModel, private dialog: DialogService, private stateEvent: IStateEvent){
      super(connectionService, gameService);
    }

    public init(){
      this.subscribe(ConnectionPath.START_VOTING_RESPONSE, new StartTimerEvent(this.model));
      this.subscribe(ConnectionPath.END_VOTING_RESPONSE, new EndVotingEvent(this.stateEvent));
      this.subscribe(ConnectionPath.VOTE_RESPONSE, new VoteEvent(this.model));
      this.subscribe(ConnectionPath.DISCONNECT_RESPONSE, new VotingDisconnectEvent(this.dialog, this.model, this.stateEvent));
      this.subscribe(ConnectionPath.VOTING_TIMER_RESPONSE, new TimerEvent(this.model));
      this.subscribeOnClose(()=>this.onCloseEvent());
    }

    private onCloseEvent(){
      this.unsubscribeAll();
      this.dialog.setMessage("dialog.disconnected").setMode(DialogMode.WARNING).setOnOkClick(()=>{
          this.stateEvent.goToMain();
      }).open(DialogComponent);
    }

    public sendStartMessage(){
      this.sendWithId(ConnectionPath.START_VOTING);
    }

    public sendVote(player:VotingPlayer){
      this.sendWithValue(ConnectionPath.VOTE, player.id);
    }

    public closeDialog(){
        this.dialog.close();
    }

    public close(){
      super.close();
      this.closeDialog();
    }
}
