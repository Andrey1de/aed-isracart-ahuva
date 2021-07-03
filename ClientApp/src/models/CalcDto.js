export class CalcDto {
    constructor() {
        this.id = -1;
        this.argX = 0;
        this.argY = 0;
        this.operation = '+';
        this.result = undefined;
        this.error = '';
        this.current = new Date();
    }
}

export class CalcRequest {

    constructor() {
        
        this.id =  -1;
        this.argX =  0;
        this.argY =   0;
        this.operation =  '';
   }
}
  