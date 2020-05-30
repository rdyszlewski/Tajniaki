
// TODO: można to przenieść do innego pliku
export enum GameStep{
    MAIN,
    LOBBY,
    VOTING,
    GAME,
    SUMMARY
}

// TODO: przerobić to na service angulara
export class AppService{
    private static currentStep: GameStep;
    
    static initialize(){    
        this.currentStep = GameStep.MAIN;
    }

    public static setCurrentStep(step:GameStep):void{
        this.currentStep = step;
    }

    public static getCurrentStep():GameStep{
        return this.currentStep;
    }
}
AppService.initialize();

