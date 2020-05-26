export class ConnectionPath{
    // LISTENING

    //      game
    public static readonly END_GAME_RESPONSE  = "/user/queue/game/end_game";
    public static readonly QUESTION_RESPONSE = "/user/queue/game/question";
    public static readonly CLICK_RESPONSE = "/user/queue/game/click";
    public static readonly ANSWER_RESPONSE = "/user/queue/game/answer";
    public static readonly START_RESPONSE = "/user/queue/game/start";
    public static readonly NEW_BOSS_RESPONSE = "/user/queue/game/new_boss";

    //      boss voting
    public static readonly START_VOTING_RESPONSE = "/user/boss/start";
    public static readonly END_VOTING_RESPONSE = "/user/boss/end";
    public static readonly VOTE_RESPONSE = "/user/boss/vote";
    public static readonly VOTING_TIMER_RESPONSE = "/user/boss/timer";

    //      lobby
    public static readonly PLAYERS_RESPONSE = "/user/lobby/players";
    public static readonly CONNECT_RESPONSE = "/user/queue/connect";
    public static readonly CHANGE_TEAM_REPONSE = "/user/lobby/team";
    public static readonly READY_RESPONSE = "/user/lobby/ready";
    public static readonly LOBBY_END_RESPONSE = "/user/queue/lobby/start";
    

    //      common
    public static readonly DISCONNECT_RESPONSE = "/user/queue/common/disconnect";

    //      summary
    public static readonly SUMMARY_RESPONSE = '/user/queue/summary/summary';

    // SENDING
    //      game
    public static readonly GAME_START = "/app/game/start";
    public static readonly CLICK = "/app/game/click";
    public static readonly QUESTION = "/app/game/question"
    public static readonly FLAG = "/app/game/flag"

    //      boss voting
    public static readonly START_VOTING = "/app/boss/start";
    public static readonly VOTE = "/app/boss/vote";

    //      lobby
    public static readonly CONNECT = "/app/lobby/connect";
    public static readonly READY = "/app/lobby/ready";
    public static readonly CHANGE_TEAM =  "/app/lobby/team";
    public static readonly AUTO_TEAM = "/app/lobby/auto_team";

    //      common
    public static readonly DISCONNECT = '/app/common/disconnect';

    //      summary
    public static readonly SUMMARY = '/app/summary/summary';
}