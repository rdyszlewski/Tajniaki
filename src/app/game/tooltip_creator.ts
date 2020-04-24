export class TooltipCreator{

      public getTooltipOptions(list: string[]){
        return {
            'placement': 'right',
            'show-delay': 500,
            'display': list.length > 0
          }
      }

      public getTooltipText(list:string[]){
        let text = "<ul>";
        list.forEach(x=>{
          text = text + "<li>" + x + "</li>";
        })
        text = text + "</ul>"
        return text;
      }
}