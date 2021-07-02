using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using S = System.Net.HttpStatusCode;
using System.Threading;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace aed_isracart_ahuva.Controllers
{
    public class CalcOperation
    {
        public double ArgX { get; set; }
        public double ArgY { get; set; }
        public string Operation { get; set; }


    }
    public class CalcResult
    {
        public int Id { get; set; }
        public double ArgX { get; set; }
        public double ArgY { get; set; }
        public string Operation { get; set; }

        public double Result { get; set; }

        public int Status { get; set; }

        public DateTime Current { get; set; } = DateTime.Now;
    }

    [Route("api/calc")]
    [ApiController]
    public class Calc : ControllerBase
    {
        static int IDX = 0;
        static string[] Operations { get; set; } =
            new string[] { "+", "-", "*", "/" };

        static readonly SortedDictionary<int, CalcResult> CalcResults =
            new SortedDictionary<int, CalcResult>();

        //// GET: api/<Calc> returns operations

        /// <summary>
        /// GET: api/calc/operations 
        /// </summary>
        /// <returns>List op possible operations as strins</returns>
        [HttpGet("operations")]
        public ActionResult<List<string>> GetOperations()
        {
            return Ok(new List<string>(Operations));
        }

        /// <summary>
        /// GET api/calc/history
        /// Retrieves the caulation's history as 
        /// </summary>
        /// <returns>List of CalcResult instances</returns>
        [HttpGet("history")]
        public ActionResult<List<CalcResult>> GetHistory()
        {
            return Ok(CalcResults.Values.ToList());
        }



        /// <summary>
        /// POST api/calc/{id} calculates the operation by CalcOperation 
        /// supplied in body {argX,argY,Operation} , 
        /// saves result in internal store
        /// </summary>
        /// <param name="calcOeration"></param>
        /// <returns>CalcResult or BadRequest</returns>
        [HttpPost]
        public  ActionResult<CalcResult> Post([FromBody] CalcOperation calcOeration)
        {
            CalcResult ret = new CalcResult()
            {
                Id = 0,
                ArgX = calcOeration.ArgX,
                ArgY = calcOeration.ArgY,
                Operation = calcOeration.Operation,
                Result = 0.0,
                Status = (int)S.OK
            };
            switch (calcOeration.Operation)
            {
                case "+":
                    ret.Result = calcOeration.ArgX + calcOeration.ArgY;
                    break;

                case "-":
                     ret.Result = calcOeration.ArgX - calcOeration.ArgY;
                    break;
                case "*":
                     ret.Result = calcOeration.ArgX * calcOeration.ArgY;
                    break;
                case "/":
                    if (calcOeration.ArgY != 0)
                    {
                        ret.Result = calcOeration.ArgX / calcOeration.ArgY;
                    }
                    else
                    {
                        ret.Status = (int)S.BadRequest;
                        return BadRequest();
                    }
                    
                    break;

                default:
                    return BadRequest();
            }
            ret.Id = Interlocked.Increment(ref IDX);
            CalcResults.Add(ret.Id, ret);

            return Ok(ret);
        }

       
        /// <summary>
        /// DELETE: api/calc/{id} instance of the history
        /// </summary>
        /// <param name="id">Identifier of history element</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public ActionResult<bool> Delete(int id)
        {
            bool b = CalcResults.ContainsKey(id);
            if (b)
            {
                CalcResults.Remove(id);
            }
            return b;
        }
    }
}
