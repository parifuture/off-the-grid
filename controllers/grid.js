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
            console.log(response);
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
            grid["gridData"].map(function(vendor) {
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
                // console.log(grid["gridData"][i]);
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
                compairingFromWeek: maxWaitTime.weekOne,
                maxTimeIncreasedWeek: maxWaitTime.weekTwo,
                maxWaitTimeIncrease: maxWaitTime.waitTime
            };
            resolve(response);
        })
    });
}

grid.getStandRecommendationByWaitTime = function () {
    
}

module.exports = grid;