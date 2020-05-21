
export enum WinnerCause{
    KILLER,
    ALL_FOUND,
    QUIT,
    UNKNOWN
}

export class CauseGetter{
    public static get(name:string): WinnerCause{
        console.log(name);
        switch(name){
            case "KILLER":
                return WinnerCause.KILLER;
            case "ALL_FOUND":
                console.log("Zwracamy wszystkie znalezione");
                return WinnerCause.ALL_FOUND;
            case "QUIT":
                return WinnerCause.QUIT;
        }
        return WinnerCause.UNKNOWN;
    }
}