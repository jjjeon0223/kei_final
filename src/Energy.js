import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./Energy.css";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function Energy(
  SMR,
  totalDemand,
  chartData,
  solarSupply,
  aggregateData,
  varK,
  month,
  essCost,
  pcsCost,
  solarSupplyRatio
) {
  // console.log(solarSupply);
  // console.log(solarSupplyRatio);
  let solarCost = 0;
  for (var l = 0; l < 24; l++) {
    solarSupply[l].solarSupply *= solarSupplyRatio;
    solarCost += solarSupply[l].solarSupply * 1700000;
  }
  for (var j = 0; j < 24; j++) {
    SMR[j].amount = aggregateData[j].amount - solarSupply[j].solarSupply;
  }
  console.log(SMR);
  console.log(solarSupply);
  function findMinDemand(mathFunc, array, property) {
    return Math[mathFunc].apply(
      array,
      array.map(function (item) {
        return item[property];
      })
    );
  }

  let minData = findMinDemand("min", SMR, "amount");
  let maxData = findMinDemand("max", SMR, "amount");
  let possibleSMR = 0;
  for (let i = 1; i < maxData / 77000 + 1; i++) {
    if (i * 77000 * 24 >= totalDemand) {
      possibleSMR = i;
      break;
    }
  }

  function parabola(totalLack, ESSdata, arrayDemand, hour17Supply, varK) {
    //parabola case revised. 7~17H
    // console.log(totalLack);
    // console.log(ESSdata);
    // console.log(arrayDemand);
    // console.log(hour17Supply);
    let chargeDataArrayParabola = [];
    let finalNextHour = hour17Supply;

    for (let k = 0.001; k < 0.1; k += 0.001) {
      //num은 몇 시까지 감소할 것이냐
      for (let num = 8; num < 13; num++) {
        //num1은 num부터 몇 시까지 현 공급을 유지할 것인지
        for (let num1 = 13; num1 < 16; num1++) {
          let revisedHourSupply = [];
          let hourChargeData = [];
          let hour9Supply = ESSdata[7].smrSupply;
          let chargeData = 0;
          for (let i = 8; i < 16; i++) {
            if (i < num) {
              hour9Supply = hour9Supply * (1 - k);
              chargeData += hour9Supply - arrayDemand[i].amount;
              revisedHourSupply.push(hour9Supply);
              hourChargeData.push(hour9Supply - arrayDemand[i].amount);
            } else if (i >= num && i < num1) {
              chargeData += hour9Supply - arrayDemand[i].amount;
              revisedHourSupply.push(hour9Supply);
              hourChargeData.push(hour9Supply - arrayDemand[i].amount);
            } else {
              hour9Supply = hour9Supply * (1 + k);
              chargeData += hour9Supply - arrayDemand[i].amount;
              revisedHourSupply.push(hour9Supply);
              hourChargeData.push(hour9Supply - arrayDemand[i].amount);
            }
          }
          if (chargeData >= totalLack) {
            if (Math.abs(1 - finalNextHour / hour9Supply) < varK) {
              chargeDataArrayParabola.push({
                charge: chargeData,
                lack: totalLack,
                hour9Supply: hour9Supply,
                finalNextHour: finalNextHour,
                K: k,
                variation: Math.abs(1 - finalNextHour / hour9Supply),
                revisedHourSupply: revisedHourSupply,
                hourChargeData: hourChargeData,
              });
            }
          }
        }
      }
    }
    // console.log(chargeDataArrayParabola);
    if (chargeDataArrayParabola.length === 0) {
      return 9999;
    }

    chargeDataArrayParabola.sort((a, b) => a.charge - b.charge);
    let revisedExtraChargeHourData =
      chargeDataArrayParabola[0].revisedHourSupply;
    return revisedExtraChargeHourData;
  }

  function findESSNecessity(arrayDemand, varK) {
    let check = 0;
    let temp = 0;
    for (let i = 0; i < arrayDemand.length - 1; i++) {
      temp = Math.abs(arrayDemand[i + 1].amount / arrayDemand[i].amount - 1);
      if (temp > check) {
        check = temp;
      }
    }
    if (check >= varK) {
      return false;
    } else {
      return true;
    }
  }

  function reallocateSupply(
    ESSdataRevised,
    arrayDemand,
    numSMR,
    pcsCost,
    essCost,
    solarCost
  ) {
    let demand = 0;
    let remainder = ESSdataRevised[23].netCharge;
    let returnArray = [];
    let reallocateArray = [];
    let reallocateInit = [];

    for (let i = 0; i < 17; i++) {
      if (i === 8) {
        returnArray.push({
          name: `${i + 1}H`,
          smrSupply: arrayDemand[i].amount,
          battery: 0,
          discharge: 0,
          charge: `${0} (- ${0})`,
          demand: arrayDemand[i].amount,
          PCS: 0,
          netCharge: 0,
        });
        continue;
      }
      returnArray.push(ESSdataRevised[i]);
    }

    for (let i = 17; i < 24; i++) {
      reallocateArray.push(ESSdataRevised[i]);
      reallocateInit.push(ESSdataRevised[i]);
      demand += ESSdataRevised[i].demand;
    }

    //고점인 지점에서 다음 고점으로
    while (remainder > 0) {
      reallocateArray.sort((a, b) => b.smrSupply - a.smrSupply);
      let change = reallocateArray.shift();
      let right =
        reallocateInit[change.index - 17 + 1] !== undefined
          ? reallocateInit[change.index - 17 + 1]
          : { smrSupply: 0 };
      let left =
        reallocateInit[change.index - 17 - 1] !== undefined
          ? reallocateInit[change.index - 17 - 1]
          : { smrSupply: 0 };
      let pivot = Math.max(right.smrSupply, left.smrSupply);
      let remainderMinus = 0;

      remainderMinus = change.smrSupply - pivot * 0.9;
      if (remainderMinus <= remainder) {
        change.smrSupply = pivot * 0.9;
        remainder -= remainderMinus;
      } else {
        remainderMinus = remainder;
        change.smrSupply -= remainderMinus;
        remainder -= remainderMinus;
      }
      reallocateInit.splice(change.index - 17, 1, change);
      reallocateArray.push(change);
    }

    let capacity = 0;
    let netCharge = ESSdataRevised[16].netCharge;
    let discharge = 0;
    let PCS = ESSdataRevised[16].PCS;
    let index = 16;

    for (let i = 0; i < reallocateInit.length; i++) {
      capacity = reallocateInit[i].smrSupply;
      if (discharge <= netCharge) {
        discharge = arrayDemand[i + 17].amount - capacity;
        netCharge -= discharge;
        PCS = Math.max(PCS, discharge);
        returnArray.push({
          name: `${index + 2 + i}H`,
          smrSupply: capacity,
          battery: Math.max(ESSdataRevised[16].battery, netCharge),
          discharge: discharge,
          charge: `${netCharge} (- ${discharge})`,
          demand: arrayDemand[i + 17].amount,
          PCS: PCS,
          netCharge: netCharge,
        });
        continue;
      } else if (netCharge === 0) {
        capacity = arrayDemand[i + 17].amount;
        discharge = 0;
        PCS = Math.max(PCS, discharge);
        returnArray.push({
          name: `${index + 2 + i}H`,
          smrSupply: capacity,
          discharge: discharge,
          charge: `${netCharge} (- ${discharge})`,
          battery: Math.max(ESSdataRevised[16].battery, netCharge),
          demand: arrayDemand[i + 17].amount,
          PCS: PCS,
          netCharge: netCharge,
        });
        continue;
      } else {
        discharge = netCharge;
        netCharge -= discharge;
        capacity = arrayDemand[i + 17].amount - discharge;
        PCS = Math.max(PCS, discharge);
        returnArray.push({
          name: `${index + 2 + i}H`,
          smrSupply: capacity,
          discharge: discharge,
          charge: `${netCharge} (- ${discharge})`,
          demand: arrayDemand[i + 17].amount,
          battery: Math.max(ESSdataRevised[16].battery, netCharge),
          PCS: PCS,
          netCharge: netCharge,
        });
        continue;
      }
    }
    returnArray[23].cost =
      returnArray[23].PCS * pcsCost +
      returnArray[23].battery * essCost +
      solarCost;

    return returnArray;
  }
  function findTotalLack(numSMR, arrayDemand, hour17Supply, varK) {
    let smrVar = varK;
    let capacity = hour17Supply;
    let totalLack = 0;

    //이 알고리즘의 한계: 그 다음 시간만을 측정하기 때문에, 몇 시간 후에 필요할 전력의 양을 고려하여 ESS에 저장하지 않음 (예측 수요에 따라 가동하게끔 할 수는 있음)
    for (let k = 17; k < 24; k++) {
      if (
        arrayDemand[k].amount > capacity &&
        arrayDemand[k].amount <= capacity * (1 + varK)
      ) {
        if (capacity * (1 + smrVar) >= 77000 * numSMR) {
          capacity = 77000 * numSMR;
        } else {
          capacity = arrayDemand[k].amount;
        }
      } else if (
        arrayDemand[k].amount < capacity &&
        arrayDemand[k].amount >= capacity * (1 - varK)
      ) {
        capacity = arrayDemand[k].amount;
      } else if (arrayDemand[k].amount > capacity) {
        if (capacity * (1 + smrVar) >= 77000 * numSMR) {
          capacity = 77000 * numSMR;
        } else {
          capacity = capacity * (1 + smrVar);
        }
      } else {
        capacity = capacity * (1 - smrVar);
      }
      let lack = arrayDemand[k].amount - capacity;
      totalLack += lack;
    }
    return totalLack;
  }

  //한 시간 안에 최대 50%까지 에너지 조정 가능
  function findESS(
    numSMR,
    arrayDemand,
    varK,
    totalLack,
    hour17Supply,
    solarCost
  ) {
    let extraCharge1to7 = 1;
    let smrVar = varK;
    let capacity = 77000 * numSMR;
    let charge = 0;
    let discharge = 0;
    let ESSdata = [];
    let surplus = 0;
    let minus = 0;
    let lack = 0;
    let initialLack = 0;

    for (let k = 0; k < 24; k++) {
      //한 시에는 정확하게 demand에 따라 공급 가능하다는 전제
      if (k === 0) {
        capacity = arrayDemand[0].amount * extraCharge1to7;
        charge += capacity - arrayDemand[0].amount;
        surplus = capacity - arrayDemand[0].amount;
        totalLack -= surplus;
        discharge += 0;
        ESSdata.push({
          name: `${k + 1}H`,
          PCS: Math.max(surplus, 0),
          demand: arrayDemand[k].amount,
          smrSupply: capacity,
          battery: capacity - arrayDemand[0].amount,
          charge: `${charge} (+ ${surplus})`,
          discharge: 0,
          lack: `${totalLack} (- ${charge})`,
        });
        continue;
      }

      if (k > 0 && k <= 6) {
        capacity = arrayDemand[k].amount * extraCharge1to7;
        surplus = capacity - arrayDemand[k].amount;
        charge += capacity - arrayDemand[k].amount;
        totalLack -= surplus;
        ESSdata.push({
          name: `${k + 1}H`,
          PCS: Math.max(surplus, ESSdata[k - 1].PCS),
          demand: arrayDemand[k].amount,
          smrSupply: capacity,
          battery: Math.max(ESSdata[k - 1].battery, charge),
          charge: `${charge} (+ ${surplus})`,
          discharge: 0,
          lack: `${totalLack} (- ${surplus})`,
        });
        continue;
      }

      if (k === 16) {
        capacity = hour17Supply;
        charge += capacity - arrayDemand[k].amount;
        ESSdata.push({
          name: `${k + 1}H`,
          PCS: Math.max(surplus, ESSdata[k - 1].PCS),
          demand: arrayDemand[k].amount,
          battery: Math.max(ESSdata[k - 1].battery, charge),
          smrSupply: capacity,
          charge: `${charge} (+ ${surplus})`,
          discharge: 0,
        });
        continue;
      }

      if (k > 16) {
        if (
          arrayDemand[k].amount > capacity &&
          arrayDemand[k].amount <= capacity * (1 + smrVar)
        ) {
          if (capacity * (1 + smrVar) >= 77000 * numSMR) {
            capacity = 77000 * numSMR;
          } else {
            capacity = arrayDemand[k].amount;
          }
        } else if (
          arrayDemand[k].amount < capacity &&
          arrayDemand[k].amount >= capacity * (1 - smrVar)
        ) {
          capacity = arrayDemand[k].amount;
        } else if (arrayDemand[k].amount > capacity) {
          if (capacity * (1 + smrVar) >= 77000 * numSMR) {
            capacity = 77000 * numSMR;
          } else {
            capacity = capacity * (1 + smrVar);
          }
        } else {
          capacity = capacity * (1 - smrVar);
        }

        if (capacity - arrayDemand[k].amount >= 0) {
          surplus = capacity - arrayDemand[k].amount;
          charge += capacity - arrayDemand[k].amount;
          ESSdata.push({
            name: `${k + 1}H`,
            PCS: Math.max(surplus, ESSdata[k - 1].PCS),
            demand: arrayDemand[k].amount,
            smrSupply: capacity,
            battery: Math.max(ESSdata[k - 1].battery, charge),
            charge: `${charge} (+ ${surplus})`,
            discharge: 0,
            lack: `${totalLack} (- ${surplus})`,
          });
        } else {
          if (charge >= arrayDemand[k].amount - capacity) {
            discharge = arrayDemand[k].amount - capacity;
            charge -= arrayDemand[k].amount - capacity;
            minus = arrayDemand[k].amount - capacity;
            ESSdata.push({
              name: `${k + 1}H`,
              PCS: Math.max(minus, ESSdata[k - 1].PCS),
              demand: arrayDemand[k].amount,
              battery: Math.max(ESSdata[k - 1].battery, charge),
              smrSupply: capacity,
              charge: `${charge} (- ${minus})`,
              discharge: arrayDemand[k].amount - capacity,
            });
          }
          //충분하지 않을 경우
          else {
            discharge = charge;
            lack = arrayDemand[k].amount - capacity - charge;
            initialLack += lack;
            charge = 0;
            ESSdata.push({
              name: `${k + 1}H`,
              PCS: Math.max(discharge, ESSdata[k - 1].PCS),
              demand: arrayDemand[k].amount,
              smrSupply: capacity,
              battery: Math.max(ESSdata[k - 1].battery, charge),
              charge: charge,
              discharge: `${discharge} (충전량이 충분치 않습니다. 필요량: ${lack})`,
              totalLack: initialLack,
            });
          }
        }
        continue;
      }

      //케이스를 두 가지로 나눌 것임. 1) 다음 시간까지 정확한 수요로 공급을 맞출 수 있는가 2) ESS가 필요한 경우
      if (
        arrayDemand[k].amount >=
          Math.min(capacity * (1 - smrVar), 77000 * numSMR) &&
        arrayDemand[k].amount <=
          Math.min(capacity * (1 + smrVar), 77000 * numSMR)
      ) {
        capacity = arrayDemand[k].amount;
        charge += 0;
        discharge += 0;
        ESSdata.push({
          name: `${k + 1}H`,
          PCS: ESSdata[k - 1].PCS,
          battery: Math.max(ESSdata[k - 1].battery, charge),
          demand: arrayDemand[k].amount,
          smrSupply: capacity,
          charge: charge,
          discharge: 0,
        });
      } else {
        if (arrayDemand[k].amount > capacity) {
          if (capacity * (1 + smrVar) >= 77000 * numSMR) {
            capacity = 77000 * numSMR;
          } else {
            capacity = capacity * (1 + smrVar);
          }
        } else {
          capacity = capacity * (1 - smrVar);
        }
        //충전해야하는 경우
        if (capacity - arrayDemand[k].amount >= 0) {
          surplus = capacity - arrayDemand[k].amount;
          charge += capacity - arrayDemand[k].amount;
          ESSdata.push({
            name: `${k + 1}H`,
            PCS: Math.max(surplus, ESSdata[k - 1].PCS),
            demand: arrayDemand[k].amount,
            smrSupply: capacity,
            battery: Math.max(ESSdata[k - 1].battery, charge),
            charge: `${charge} (+ ${surplus})`,
            discharge: 0,
            lack: `${totalLack} (- ${surplus})`,
          });
        }
        //방전해야하는경우
        else {
          //방전을 하게 된다면, 현재 충전량이 충분한가
          if (charge >= arrayDemand[k].amount - capacity) {
            discharge = arrayDemand[k].amount - capacity;
            charge -= arrayDemand[k].amount - capacity;
            minus = arrayDemand[k].amount - capacity;
            ESSdata.push({
              name: `${k + 1}H`,
              PCS: Math.max(minus, ESSdata[k - 1].PCS),
              demand: arrayDemand[k].amount,
              smrSupply: capacity,
              battery: Math.max(ESSdata[k - 1].battery, charge),
              charge: `${charge} (- ${minus})`,
              discharge: arrayDemand[k].amount - capacity,
            });
          }
          //충분하지 않을 경우
          else {
            discharge = charge;
            lack = arrayDemand[k].amount - capacity - charge;
            initialLack += lack;
            charge = 0;
            ESSdata.push({
              name: `${k + 1}H`,
              PCS: Math.max(discharge, ESSdata[k - 1].PCS),
              demand: arrayDemand[k].amount,
              smrSupply: capacity,
              charge: charge,
              battery: Math.max(ESSdata[k - 1].battery, charge),
              discharge: `${discharge} (충전량이 충분치 않습니다. 필요량: ${lack})`,
              totalLack: initialLack,
            });
          }
        }
      }
    }

    let revisedExtraChargeHourData = parabola(
      totalLack,
      ESSdata,
      arrayDemand,
      hour17Supply,
      varK
    );
    if (revisedExtraChargeHourData === 9999) {
      return 9999;
    }
    let ESSdataRevised = [];
    //추가 충전분을 반영하여 ESSData 다시 계산하기
    for (let k = 0; k < 24; k++) {
      //한 시에는 정확하게 demand에 따라 공급 가능하다는 전제

      if (k < 8) {
        ESSdataRevised.push(ESSdata[k]);
      }

      if (k >= 8 && k < 16) {
        capacity = revisedExtraChargeHourData[k - 8];
        if (capacity >= arrayDemand[k].amount) {
          surplus = capacity - arrayDemand[k].amount;
          charge += capacity - arrayDemand[k].amount;
          ESSdataRevised.push({
            index: k,
            name: `${k + 1}H`,
            PCS: Math.max(surplus, ESSdataRevised[k - 1].PCS),
            demand: arrayDemand[k].amount,
            smrSupply: capacity,
            battery: Math.max(ESSdataRevised[k - 1].battery, charge),
            charge: `${charge} (+ ${surplus})`,
            netCharge: charge,
            discharge: 0,
          });
        } else {
          discharge = Math.abs(arrayDemand[k].amount - capacity);
          charge -= Math.abs(arrayDemand[k].amount - capacity);
          minus = Math.abs(arrayDemand[k].amount - capacity);
          ESSdataRevised.push({
            index: k,
            name: `${k + 1}H`,
            PCS: Math.max(minus, ESSdataRevised[k - 1].PCS),
            demand: arrayDemand[k].amount,
            smrSupply: capacity,
            battery: Math.max(ESSdataRevised[k - 1].battery, charge),
            charge: `${charge} (- ${minus})`,
            netCharge: charge,
            discharge: arrayDemand[k].amount - capacity,
          });
        }
        continue;
      }

      if (k === 16) {
        capacity = hour17Supply;
        charge += capacity - arrayDemand[k].amount;
        ESSdataRevised.push({
          index: k,
          name: `${k + 1}H`,
          PCS: Math.max(surplus, ESSdataRevised[k - 1].PCS),
          demand: arrayDemand[k].amount,
          smrSupply: capacity,
          charge: `${charge} (+ ${surplus})`,
          battery: Math.max(ESSdataRevised[k - 1].battery, charge),
          netCharge: charge,
          discharge: 0,
        });
      }

      if (k > 16) {
        if (
          arrayDemand[k].amount > capacity &&
          arrayDemand[k].amount <= capacity * (1 + smrVar)
        ) {
          if (capacity * (1 + smrVar) >= 77000 * numSMR) {
            capacity = 77000 * numSMR;
          } else {
            capacity = arrayDemand[k].amount;
          }
        } else if (
          arrayDemand[k].amount < capacity &&
          arrayDemand[k].amount >= capacity * (1 - smrVar)
        ) {
          capacity = arrayDemand[k].amount;
        } else if (arrayDemand[k].amount > capacity) {
          if (capacity * (1 + smrVar) >= 77000 * numSMR) {
            capacity = 77000 * numSMR;
          } else {
            capacity = capacity * (1 + smrVar);
          }
        } else {
          capacity = capacity * (1 - smrVar);
        }

        if (capacity >= arrayDemand[k].amount) {
          surplus = capacity - arrayDemand[k].amount;
          charge += capacity - arrayDemand[k].amount;
          ESSdataRevised.push({
            index: k,
            name: `${k + 1}H`,
            PCS: Math.max(surplus, ESSdataRevised[k - 1].PCS),
            demand: arrayDemand[k].amount,
            smrSupply: capacity,
            charge: `${charge} (+ ${surplus})`,
            battery: Math.max(ESSdataRevised[k - 1].battery, charge),
            netCharge: charge,
            discharge: 0,
          });
        } else {
          discharge = arrayDemand[k].amount - capacity;
          charge -= arrayDemand[k].amount - capacity;
          minus = arrayDemand[k].amount - capacity;
          ESSdataRevised.push({
            index: k,
            name: `${k + 1}H`,
            PCS: Math.max(minus, ESSdataRevised[k - 1].PCS),
            demand: arrayDemand[k].amount,
            smrSupply: capacity,
            battery: Math.max(ESSdataRevised[k - 1].battery, charge),
            charge: `${charge} (- ${minus})`,
            netCharge: charge,
            discharge: arrayDemand[k].amount - capacity,
          });
        }
        continue;
      }
    }
    let clonedArray = JSON.parse(JSON.stringify(ESSdataRevised));
    let netChargeZeroESS = reallocateSupply(
      clonedArray,
      arrayDemand,
      numSMR,
      pcsCost,
      essCost,
      solarCost
    );
    return netChargeZeroESS;
  }

  let ESSdata = [];
  let minPCS = 9999999;
  let PCSdata = [];
  console.log(SMR);

  if (findESSNecessity(SMR, varK)) {
    let data = [];
    for (let i = 0; i < SMR.length; i++) {
      data.push({
        name: `${1 + i}H`,
        smrSupply: SMR[i].amount,
        battery: 0,
        discharge: 0,
        charge: 0,
        demand: SMR[i].amount,
        PCS: 0,
        netCharge: 0,
        cost: 0,
      });
    }
    ESSdata.push(data);
  } else {
    for (let i = 0; i < varK * 2; i += 0.001) {
      let hour17Supply = SMR[16].amount * (1 - varK + i);
      let temp = findESS(
        possibleSMR,
        SMR,
        varK,
        findTotalLack(possibleSMR, SMR, hour17Supply, varK),
        hour17Supply,
        solarCost
      );
      if (temp === 9999) {
        continue;
      }
      PCSdata.push(temp);
    }
    PCSdata.sort((a, b) => a[23].cost - b[23].cost);
    ESSdata.push(PCSdata[0]);
  }
  // if (ESSdata.length === 0) {
  //   return <h1>NOOOOOOO</h1>;
  // }
  console.log(ESSdata);

  if (ESSdata[0] === undefined) {
    return [9999, solarSupply, SMR];
  } else {
    ESSdata[0][23].possibleSMR = possibleSMR;
    return [ESSdata, solarSupply, SMR, solarSupplyRatio];
  }

  // <div className="energy">
  //   <ResponsiveContainer width="100%" aspect={3}>
  //     <ComposedChart
  //       width={500}
  //       height={300}
  //       margin={{
  //         top: 5,
  //         right: 30,
  //         left: 20,
  //         bottom: 5,
  //       }}
  //     >
  //       <CartesianGrid strokeDasharray="3 3" />
  //       <XAxis dataKey="name" allowDuplicatedCategory={false} />
  //       <YAxis />
  //       <Tooltip />
  //       <Legend />
  //       {ESSdata.map((data, index) => (
  //         <Area
  //           type="monotone"
  //           name="Final SMR Supply"
  //           data={data}
  //           stackId="1"
  //           dataKey="smrSupply"
  //           stroke="lightgray"
  //           fill="lightgray"
  //         />
  //       ))}
  //       <Line
  //         type="monotone"
  //         dataKey="amount"
  //         name="Net Demand after Solar Supply"
  //         data={SMR}
  //         stackId="1"
  //         stroke="gray"
  //         fill="gray"
  //       />
  //       <Line
  //         type="monotone"
  //         name="가로등"
  //         data={chartData[0]}
  //         dataKey="amount"
  //         stroke="blue"
  //       />
  //       <Line
  //         type="monotone"
  //         name="교육용"
  //         data={chartData[1]}
  //         dataKey="amount"
  //         stroke="red"
  //       />
  //       <Line
  //         type="monotone"
  //         name="농사용"
  //         data={chartData[2]}
  //         dataKey="amount"
  //         stroke="#8884d8"
  //       />
  //       <Line
  //         type="monotone"
  //         name="산업용"
  //         data={chartData[3]}
  //         dataKey="amount"
  //         stroke="green"
  //       />
  //       <Line
  //         type="monotone"
  //         name="심야"
  //         data={chartData[4]}
  //         dataKey="amount"
  //         stroke="orange"
  //       />
  //       <Line
  //         type="monotone"
  //         name="일반용"
  //         data={chartData[5]}
  //         dataKey="amount"
  //         stroke="purple"
  //       />
  //       <Line
  //         type="monotone"
  //         name="주택용"
  //         data={chartData[6]}
  //         dataKey="amount"
  //         stroke="pink"
  //       />
  //       <Line
  //         type="monotone"
  //         name="총합"
  //         data={aggregateData}
  //         dataKey="amount"
  //         stroke="black"
  //       />
  //       <Area
  //         type="monotone"
  //         name="태양광 발전 용량"
  //         data={solarSupply}
  //         stackId="1"
  //         dataKey="solarSupply"
  //         stroke="#ffc658"
  //         fill="#ffc658"
  //       />
  //     </ComposedChart>
  //   </ResponsiveContainer>
  //   <p>총 수요: {totalDemand}</p>
  //   <p>17시 가중치: {ESSdata[0][16].smrSupply / SMR[16].amount}</p>
  //   <p>
  //     ESS Cost:{" "}
  //     {(ESSdata[0][23].battery * essCost)
  //       .toFixed(2)
  //       .toString()
  //       .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
  //     원{" "}
  //   </p>
  //   <p>
  //     PCS Cost:{" "}
  //     {(ESSdata[0][23].PCS * pcsCost)
  //       .toFixed(2)
  //       .toString()
  //       .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
  //     원{" "}
  //   </p>
  //   <p>
  //     Solar Cost:{" "}
  //     {solarCost
  //       .toFixed(2)
  //       .toString()
  //       .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
  //     원{" "}
  //   </p>
  //   <p>
  //     Total Cost:{" "}
  //     {ESSdata[0][23].cost
  //       .toFixed(2)
  //       .toString()
  //       .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
  //     원
  //   </p>
  //   {ESSdata[0] === "No ESS Needed" ? (
  //     <p>No ESS Needed</p>
  //   ) : (
  //     ESSdata.map((datas, index) => (
  //       <TableContainer component={Paper} className="table" key={index}>
  //         <h4>
  //           ESS Data (단위: kWh, SMR 개수: {ESSdata[0][23].possibleSMR})
  //         </h4>
  //         <Table size="small" aria-label="a dense table">
  //           <TableHead>
  //             <TableRow>
  //               <TableCell>Hour</TableCell>
  //               <TableCell align="right">Demand</TableCell>
  //               <TableCell align="right">SMR Supply</TableCell>
  //               <TableCell align="right">PCS Capacity</TableCell>
  //               <TableCell align="right">ESS Battery Capacity</TableCell>
  //               <TableCell align="right">Net Charge</TableCell>
  //               <TableCell align="right">Discharge</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {datas.map((data) => (
  //               <TableRow key={data.hour}>
  //                 <TableCell component="th" scope="row">
  //                   {data.name}
  //                 </TableCell>
  //                 <TableCell align="right">{data.demand}</TableCell>
  //                 <TableCell align="right">{data.smrSupply}</TableCell>
  //                 <TableCell align="right">{data.PCS}</TableCell>
  //                 <TableCell align="right">{data.battery}</TableCell>
  //                 <TableCell align="right">{data.charge}</TableCell>
  //                 <TableCell align="right">{data.discharge}</TableCell>
  //               </TableRow>
  //             ))}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     ))
  //   )}
  // </div>
}

// export default Energy;
