export class CalcDto {
    constructor(id) {
        this.id = id;
        this.argX = 0;
        this.argY = 0;
        this.operation = '+';
        this.result = undefined;
        this.date = new Date();
    }
}