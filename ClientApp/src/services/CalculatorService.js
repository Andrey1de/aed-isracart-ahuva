
import { jsonPOST$, jsonDELETE$, jsonGET$ } from './JsonHttpService'
import { CalcDto} from '../models/CalcDto';
import { Subject } from 'rxjs';

///TO USER SERVER - MOK have been set to  0
export const MOK = 0;
const BASE_URL_0 = 'http://localhost:5000/api/calc';

///=========================================================
/// Service singletone to store operation and history of them
///=========================================================
class CalcClass {
    static ID = 0;
    static CMap =  new Map ();//<id,CalcDto>
    EvHistory = () => this.SubjectHistory.asObservable();
    EvCalcResult = () => this.SubjectResultCalc.asObservable();
    EvSelect = () => this.SubjectSelect.asObservable();
 
    
    constructor() {
        this.Operations = ['+', '-', '*', '/'];
        this.SelectedDto = undefined;
        this.SubjectHistory = new Subject();
        this.SubjectResultCalc = new Subject();
        this.SubjectSelect = new Subject();
 
    }

   
   //=== CALCULATION SERVICE =====
  
    //CALCULATES  (x, y, op) returns status , reult and ID 
    // stores item in internal cache and  the server
    // returns {dto:CalcDto,error}   

    toCalculate = (x, y, op , id) =>{
        let dto = new CalcDto();
        id = id || -1;
        dto.id = +id;
        dto.argX = x;
        dto.argY = y;
        dto.argY = y;
        dto.operation = op;
       // onEvCalculateInternal(dto);

        //this._subjectCalculate.next(dto);
        this._calcByServer$(dto).then(
            dtoRes => {
                this.sendCalcResult(dto);
                if (!dtoRes.error) {
                    this.sendHistory();
                }
                console.dir(dtoRes);
               // this.SubjectResultCalc(dtoRes);
            }
        ).catch (
            err => {
                console.log(err);
            }
        )

    }

     _calcByServer$ = async (dto) => { // {res,err,id}
        dto.result = 'N/A';
        dto.error = undefined;

        if (dto.operation === '/' && !dto.argY) {
            dto.error = 'Divide by Zero';
            return dto;
        }
        
       // debugger;
        dto.id = (+dto.id > 0) ? +dto.id : ++CalcClass.ID;
        let _data = {}
        this.SelectedDto = undefined;
     //==================== WEB API PART ===============

        try {
           
            if (!MOK) {
                const req = {
                    id: dto.id,
                    argX: dto.argX,
                    argY: dto.argY,
                    operation: dto.operation
                };
                
                _data = await jsonPOST$(BASE_URL_0,req);
              
            } else {
                //This helpe works only in debud MOK mode
               _data =  await this.calcByMok(+dto.argX, +dto.argY,  dto.operation);
           
            }
            
            dto.error = _data?.error || '';
    
            if (!dto.error) {
                dto.result = _data.result;
                CalcClass.CMap.set(dto.id, dto);
                this.SelectedDto = undefined;
               
            } else {
                dto.result = 'N/A';
            }

        } catch (error) {
            dto.result = 'ERROR';
            dto.error = 'Server Error:' + error;
        }

       
        return dto;
    }
    
    sendCalcResult = (dto) => {
       // const _history = this.getHistory();
        console.log('=>sendCalcResult(' + dto.result + ')');
        this.SubjectResultCalc.next(dto);
    }

    // Helper, works only in MOK (serverless) mode
    async calcByMok(x, y, op ) {
        let ret = 0;
        switch (op) {
            case '+': ret = x + y; break;
            case '-': ret = x - y; break;
            case '*': ret = x * y; break;
            case '/': ret = x / y; break;
            default:
                return {status:4,result:'N/A'}
        }
        return {status:200,result:ret};
    }

    // Retrieves operation from server
    
    // Returns IEnumerable<string[]>
    getOperations$ = async () => { //  CalcDto[]
        if (!MOK) {
            const ret = await jsonGET$(BASE_URL_0 + '/operations');
            this.Operations = [...ret];
        } 
            return this.Operations;
    }

 //=== HISTORY SERVICE =====
    
 
      //Used to fill the history in the page
    // Returns CalcDto[]
    getHistory = () => { //  CalcDto[]
        //TBD retrieve from server
        const ret = [...CalcClass.CMap.values()].reverse();
        console.log('=>getHistory(' + ret.length + ')');
        return ret;
    }

    //Downloads old history from the server
    loadHistory$ = async () => { //  CalcDto[]
        CalcClass.CMap.clear();
        if (!MOK) {
            try {
                let _data = await jsonGET$(BASE_URL_0 + '/history') ;
                    CalcClass.CMap.clear();
                    _data = [];
                    _data.map((dto) => {
                        CalcClass.CMap.set(dto.id, dto);
                        return CalcClass.ID = Math.max(dto.id, CalcClass.ID);
                    });

               
            } catch (error) {
                console.log('Error to load history from server')
            }
        
        }
        const ret = [...CalcClass.CMap.values()].reverse();
        console.log('=>loadHistory(' + ret.length + ')');
        return ret;
    }

    sendHistory = () => {
       // const _history = this.getHistory();
        const size = CalcClass.CMap.size;
        console.log('=>sendHistory(' + size + ')');
        this.SubjectHistory.next(size);
    }

    //DELETES requested ID item from history
    //both from internal cache and  the server
    // Returns true if succeded

    removeHistoryRow = (id) => {
        if (CalcClass.CMap.has(+id)) {
            CalcClass.CMap.delete(+id);
            this.sendHistory();
            if (!MOK) {
                jsonDELETE$(BASE_URL_0 + '/' + id)
                    .then(b => {
                        if (b) console.log('=>Removed from server id=' + id);
                    }).catch(e => {
                         console.log('=>Error on server removed  id=' + id + ' error :' + e);
                    });
            }
        
        }
    }

    //==============SELECT========================= 

    getById = (id) => { //  id or 0
        return  CalcClass.CMap.get(id);;
    }

    getSelectedDto = (id) => { //  id or 0
        return this.SelectedDto;
    }

    getSelectedID = (id) => { //  id or 0
        return this.SelectedDto?.id || -1;
    }

    setSelected = (id) => { //  id or 0
        this.SelectedDto = CalcClass.CMap.get(id);
        this.SubjectSelect.next(this.getSelectedID());
    }
    
    
}

export const CalculatorService = new CalcClass();

// Response body
// Download
// {
//   "id": 4,
//   "argX": 1,
//   "argY": 2,
//   "operation": "+",
//   "result": 3,
//   "error": "",
//   "current": "2021-06-30T20:58:19.3168258+03:00"
// }

  // onEvCalculateInternal = (dto) {

    //     calcByServer$(dto).then(
    //         dtoRes => {
    //             this.subjectResultCalc(dtoRes);
    //         }
    //     ).catch (
    //         err => {
    //             dto.result = 'N/A';
    //             dto.error = err;
    //             this.subjectResultCalc(dto);
    //         }
    //     )
       
    // }