import { DialogMode } from './dialogMode';

export class DialogModel{
    message: string;
    mode: DialogMode;
    onOkEvent;
    onCancelEvent;
}