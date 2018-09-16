'use strict';
const csv = require('csvtojson')
const config = require('./../config/config');
const math = require('mathjs');
// local
const grid = {
    config: config.csv,
    gridData: [],
    // csvDataModel: [
    //     {
    //         // standNumber,
    //         // weekNumber,
    //         // price,
    //         // waitTime,
    //         // tastiness
    //     }
    // ]
};

grid.getCsvData = function() {
    return new Promise((resolve, reject) => {
        csv({ 
            noheader: true,
            headers: ["standNumber","weekNumber","price","waitTime","tastiness"]
        })
        .fromFile(config.csvFilePath)
        .then((response)=> {
            grid.gridData = response;
            resolve(response);
        })
    }).catch((err) => {
        reject(err);
    });
}

grid.totalMoneySpent = function () {
    return new Promise((resolve, reject) => {
        grid.getCsvData()
        .then(() => {
            let totalExpenditure = 0;    
            grid["gridData"].map((vendor) => {
                totalExpenditure = math.add(totalExpenditure, vendor["price"]);
            });
            totalExpenditure = math.round(totalExpenditure, 2);
            const response = {
                totalExpenditure: totalExpenditure
            };
            resolve(response);
        })
    });
}

grid.mostPopularStandByWaitTime = function () {
    return new Promise((resolve, reject) => {
        grid.getCsvData()
        .then(() => {
            // assumption that standNumber will always start from 0
            let maxWaitTime = {
                standNumber:0,
                weekOne:0,
                waitTimeWeek1:0,
                weekTwo:0,
                waitTimeWeek2:0,
                waitTime:0
            };
            let newWaitTime = 0;
            for(let i=0;i<grid["gridData"].length;i++) {
                if(typeof grid["gridData"][i+1] != 'undefined') {
                    if(math.number(grid["gridData"][i].standNumber) !== math.number(grid["gridData"][i+1].standNumber)) {
                        continue;
                    } else {
                        newWaitTime = math.subtract(grid["gridData"][i+1].waitTime, grid["gridData"][i].waitTime);
                        if(newWaitTime > maxWaitTime.waitTime) {
                            maxWaitTime.standNumber = grid["gridData"][i].standNumber;
                            maxWaitTime.weekOne = grid["gridData"][i].weekNumber;
                            maxWaitTime.waitTimeWeek1 = grid["gridData"][i].waitTime;
                            maxWaitTime.weekTwo = grid["gridData"][i+1].weekNumber;
                            maxWaitTime.waitTimeWeek2 = grid["gridData"][i+1].waitTime;
                            maxWaitTime.waitTime = newWaitTime;
                        }
                    }
                }
            }
            const response = {
                standNumber: maxWaitTime.standNumber,
                weekBeforeMaxIncrease: maxWaitTime.weekOne,
                weekOfMaxIncrease: maxWaitTime.weekTwo,
                maxWaitTimeIncreased: maxWaitTime.waitTime
            };
            resolve(response);
        })
    });
}

grid.isEmpty = function (obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

grid.getStandRecommendationByTime = function (timeLimit=45) {
    return new Promise((resolve, reject) => {
        // converting string timeLimit to Integer
        timeLimit = math.number(timeLimit);
        let meanTimeArray = [], meanTime = 0 , meanTastinessArray=[], meanTastiness = 0;
        grid.getCsvData()
        .then(() => {
            let newGridData = [];
            let vendorObj = {};
            // START logic to calculate the mean waittime and tastiness
            for(let i=0;i<grid["gridData"].length;i++) {
                if(typeof grid["gridData"][i+1] != 'undefined') {
                    if(math.number(grid["gridData"][i].standNumber) !== math.number(grid["gridData"][i+1].standNumber)) {
                        // calculating the mean for the time and tastiness from the CSV values
                        meanTime = math.mean(meanTimeArray);
                        meanTastiness = math.mean(meanTastinessArray);
                        
                        // rounding off the value to the nearest integer
                        meanTime = math.round(meanTime);
                        meanTastiness = math.round(meanTastiness);
                        
                        // reset the array for the next stand
                        meanTimeArray = [], meanTastinessArray = [];
                        
                        // create a new object containing
                        // 1)stand number, 2)waittime, 3)tastiness
                        vendorObj.standNumber =  grid["gridData"][i].standNumber;
                        vendorObj.waitTime = meanTime;
                        vendorObj.tastiness = meanTastiness;
                        newGridData.push(vendorObj);
                        vendorObj = {};
                    } else {
                        // push the waitTime for stand # in an array
                        meanTimeArray.push(grid["gridData"][i].waitTime);
                        meanTastinessArray.push(grid["gridData"][i].tastiness);
                    }
                }
            }
            // END logic to calculate the mean waittime and tastiness
            
            // TEST Data 1
            // newGridData = [
            //     {standNumber: "0", waitTime: 1, tastiness: 6},
            //     {standNumber: "1", waitTime: 2, tastiness: 7},
            //     {standNumber: "2", waitTime: 4, tastiness: 3},
            //     {standNumber: "3", waitTime: 3, tastiness: 10},
            //     {standNumber: "4", waitTime: 5, tastiness: 4}
            // ];

            // TEST Data 2
            // newGridData = [
            //     {standNumber: "0", waitTime: 10, tastiness: 6},
            //     {standNumber: "1", waitTime: 20, tastiness: 7},
            //     {standNumber: "2", waitTime: 40, tastiness: 100},
            //     {standNumber: "3", waitTime: 30, tastiness: 10},
            //     {standNumber: "4", waitTime: 15, tastiness: 4}
            // ];

            //test Data 3
            newGridData = [
                {standNumber: "0", waitTime: 5, tastiness: 6},
                {standNumber: "1", waitTime: 11, tastiness: 7},
                {standNumber: "2", waitTime: 8, tastiness: 3},
                {standNumber: "3", waitTime: 12, tastiness: 5},
                {standNumber: "4", waitTime: 16, tastiness: 4},
                {standNumber: "5", waitTime: 14, tastiness: 7},
                {standNumber: "6", waitTime: 14, tastiness: 5},
                {standNumber: "7", waitTime: 7, tastiness: 7},
                {standNumber: "8", waitTime: 11, tastiness: 6},
                {standNumber: "9", waitTime: 10, tastiness: 7},
                {standNumber: "10", waitTime: 13, tastiness: 5},
                {standNumber: "11", waitTime: 16, tastiness: 5},
                {standNumber: "12", waitTime: 16, tastiness: 6},
                {standNumber: "13", waitTime: 24, tastiness: 7},
                {standNumber: "14", waitTime: 10, tastiness: 6},
                {standNumber: "15", waitTime: 8, tastiness: 7},
                {standNumber: "16", waitTime: 6, tastiness: 4},
                {standNumber: "17", waitTime: 13, tastiness: 7},
                {standNumber: "18", waitTime: 19, tastiness: 6},
                {standNumber: "19", waitTime: 4, tastiness: 4},
                {standNumber: "20", waitTime: 16, tastiness: 7},
                {standNumber: "21", waitTime: 7, tastiness: 7},
                {standNumber: "22", waitTime: 10, tastiness: 4}
            ]

            let gridVendorArrayLength = newGridData.length;
            vendorObj = {
                standNumber: [],
                waitTime: 0,
                tastiness: 0
            };
            let start = 0, end = 1;
            let resultList = [];
            let flag = true;
            let currentWaitTime = newGridData[0].waitTime;
            let counter = 0;

            while(start <= end && end <= gridVendorArrayLength) {
                if(currentWaitTime <= timeLimit) {
                    if(flag) {
                        vendorObj["standNumber"].push(newGridData[start].standNumber);
                        vendorObj.waitTime += newGridData[start].waitTime;
                        vendorObj.tastiness += newGridData[start].tastiness;
                        currentWaitTime = newGridData[start].waitTime;
                        flag = false;
                    }
                    // count += end - start;
                    if(end < gridVendorArrayLength) {
                        vendorObj["standNumber"].push(newGridData[end].standNumber);
                        vendorObj.waitTime += newGridData[end].waitTime;
                        vendorObj.tastiness += newGridData[end].tastiness;
                        currentWaitTime += newGridData[end].waitTime;
                    }
                    end++
                } else {
                    vendorObj["standNumber"].pop();
                    vendorObj.waitTime -= newGridData[end-1].waitTime;
                    vendorObj.tastiness -= newGridData[end-1].tastiness;
                    if(resultList.length === 0) {
                        resultList.push(vendorObj);
                    } else {
                        if(resultList[0].tastiness < vendorObj.tastiness) {
                            resultList.pop();
                            resultList.push(vendorObj);
                        }
                    }
                    if(vendorObj["standNumber"].length > 1) {
                        end--;
                    }

                    vendorObj = {
                        standNumber: [],
                        waitTime: 0,
                        tastiness: 0
                    };
                    if(end == gridVendorArrayLength - 1) {
                        currentWaitTime = newGridData[start++].waitTime;
                        end = start + 1;
                    } else {
                        currentWaitTime = newGridData[start].waitTime;
                        if(currentWaitTime > timeLimit) {
                            currentWaitTime = newGridData[start++].waitTime;
                            end = start + 1;
                        }
                    }
                    
                    flag = true;
                }
                // counter to see how many times the loop was getting executed
                // heled in finding edge conditions
                // counter++;
                // if(counter%1000 === 0) {
                //     console.log("counter",counter);
                // }
            }
            let response = {
                standNumbers: resultList[0].standNumber,
                totalTimeUsed: resultList[0].waitTime,
                totalTastinessAcquired: resultList[0].tastiness
            };

            resolve(response);
        })
    });
}

module.exports = grid;