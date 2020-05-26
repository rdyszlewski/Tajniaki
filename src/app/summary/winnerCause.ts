
export enum WinnerCause{
    KILLER,
    ALL_FOUND,
    QUIT,
    UNKNOWN
}

export class CauseGetter{
    public static get(name:string): WinnerCause{
        switch(name){
            case "KILLER":
                return WinnerCause.KILLER;
            case "ALL_FOUND":
                return WinnerCause.ALL_FOUND;
            case "QUIT":
                return WinnerCause.QUIT;
        }
        return WinnerCause.UNKNOWN;
    }
}