
import { jsonPOST$, jsonDELETE$ } from '../services/JsonHttpService'
import { CalcDto } from '../models/CalcDto';
import { Subject } from 'rxjs';
//import { jsonPOST$, jsonGET$, jsonDELETE$ } from '../services/JsonHttpService'
export const MOK = 1;
const BASE_URL_0 = 'http://localhost:5000/';

///=========================================================
/// Service singletone to store operation and history of them
///=========================================================
class CalcServiceSingle {
    static ID = 0;
    static CMap =  new Map ();//<id,CalcDto>
    static Operations = ['+', '-', '*', '/'];//<id,CalcDto>
    
   
    
    constructor() {
        this.Selected = undefined;
        this.subjectHistory = new Subject();
    }

    onHistory = () => this.subjectHistory.asObservable();

    //CALCULATES  (x, y, op) returns status , reult and ID 
    // stores item in internal cache and  the server
    // returns {dto:CalcDto,error}   
    calcByServer$ = async (x, y, op) => { // {res,err,id}
        let retValue = { dto: undefined , error: '' }
        const _x = +x;
        const _y = +y;
        let _data = {};
  
        if (op === '/' && !y) {
            retValue.error = 'Divide by Zero';
            return retValue;
        }
        this.Selected = undefined;
     //==================== WEB API PART ===============

 
   //     debugger;
        try {
           
            if (!MOK) {
                _data = await jsonPOST$ (BASE_URL_0 + 'api/calc', {
                    "argX": x,
                    "argY": y,
                    "operation": op
                });
              
            } else {
               _data =  await this.calcByMok(_x, _y, op);
           
            }
            
            const  _status = +_data?.status;
            const _result = _data?.result;
            const _id = +_data?.id;
           
            if (+_status !== 200) {
                retValue.error = 'HTTP Error status:' + _status;
            } else {
                let dto = new CalcDto(_id);
                dto.argX = _x;
                dto.argY = _y;
                dto.operation = op;
                dto.result = _result;
                CalcServiceSingle.CMap.set(dto.id, dto);
                this.Selected = dto;
                retValue.dto = dto;
                 
            }
         //   this.subjectHistory.next(_id);

        } catch (error) {
          
            retValue.error = 'Server Error:' + error;
        }
        return retValue;
    }


      // Helper, works only in MOK (serverless) mode
    async calcByMok(x, y, op) {
        let ret = 0;
        switch (op) {
            case '+': ret = x + y; break;
            case '-': ret = x - y; break;
            case '*': ret = x * y; break;
            case '/': ret = x / y; break;
            default:
                throw new Error('Not Supported');
        }
        return {status:200,result:ret,id:++CalcServiceSingle.ID};
    }


    //DELETES requested ID item from history
    //both from internal cache and  the server
    // Returns true if succeded
    removeById$ = async (id) => { //{ //  CalcDto[]
        const ret = CalcServiceSingle.CMap.delete(+id);
        this.subjectHistory.next(-1);

        this.Selected = undefined;
        if (!MOK) {
            jsonDELETE$(BASE_URL_0 + 'api/calc/' + id)
                .then(d => {}).catch(e => { })
        }
        return ret;
    }
    //Used to fill the history in the page
    // Returns IEnumerable<CalcDto[]>
    getHistory = () => { //  CalcDto[]
        //TBD retrieve from server
        const ret = [...CalcServiceSingle.CMap.values()].reverse();
        console.log('=>getHistory(' + ret.length + ')')
        return ret;
    }
    
    // Returns IEnumerable<string[]>
    getOperations$ = async () => { //  CalcDto[]
        if (MOK) {
            return CalcServiceSingle.Operations;
        } else {
            return CalcServiceSingle.Operations;
    
        }
    }

    getSelectedDto = (id) => { //  id or 0
        return this.Selected;
    }
    setSelectedDto = (id) => { //  id or 0
        this.Selected = CalcServiceSingle.CMap.get(id);
        return  this.Selected ;
    }
    getById = (id) => { // CalcDto
        return CalcServiceSingle.CMap.get(+id);
    }
    
}

export const CalcService = new CalcServiceSingle();

// Response body
// Download
// {
//   "id": 4,
//   "argX": 1,
//   "argY": 2,
//   "operation": "+",
//   "result": 3,
//   "status": 200,
//   "current": "2021-06-30T20:58:19.3168258+03:00"
// }