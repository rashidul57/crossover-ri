var express = require('express'),
    _ = require('underscore'),
    config = require('./config'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    path = require('path'),
    port = config.port,
    ip = config.ip,
    app, dataSource;

app = module.exports = express();

// Configuration
app.set('view engine', 'html');
app.set('view options', { layout: false })
  
app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true, secret: 'cross secret' }));

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '')));


dataSource = {
    report1: [
        {id: 'master1', changeList: 545443, owner: 'jTuck', date: '12 / 12 / 2015', time: '5:12 am', status: 'pending', level: 3},
        {id: 'master2', changeList: 343444, owner: 'Dora', date: '03 / 11 / 2014', time: '4:53 am', status: 'running', level: 3},
        {id: 'master3', changeList: 763445, owner: 'Mouck', date: '12 / 05 / 2015', time: '4:12 pm', status: 'failed', level: 3},
        {id: 'master4', changeList: 565665, owner: 'Samy', date: '12 / 02 / 2012', time: '4:22  am', status: 'passed'},
        {id: 'master7', changeList: 878784, owner: 'Dora', date: '11 / 01 / 2013', time: '9:21 pm', status: 'failed', level: 1}
    ],
    report2: [
        {id: 'master1', changeList: 565656, owner: 'Siam', date: '12 / 12 / 2015', time: '5:12 am', status: 'pending', level: 3},
        {id: 'master3', changeList: 977875, owner: 'Andre', date: '12 / 05 / 2015', time: '4:12 pm', status: 'failed', level: 3},
        {id: 'master4', changeList: 565333, owner: 'Russel', date: '10 / 12 / 2014', time: '10:33 am', status: 'passed'},
        {id: 'master5', changeList: 656565, owner: 'Khora', date: '03 / 11 / 2014', time: '4:53 am', status: 'running', level: 3},
        {id: 'master6', changeList: 778788, owner: 'Pnich', date: '12 / 05 / 2015', time: '4:12 pm', status: 'failed', level: 2},
        {id: 'master7', changeList: 878784, owner: 'Kheks', date: '11 / 01 / 2013', time: '9:21 pm', status: 'failed', level: 1},
        {id: 'master8', changeList: 676776, owner: 'Kerry', date: '12 / 12 / 2015', time: '5:12 am', status: 'pending', level: 1},
        {id: 'master9', changeList: 676776, owner: 'Kehd', date: '12 / 12 / 2015', time: '5:12 am', status: 'pending', level: 2},
        {id: 'master10', changeList: 656565, owner: 'Khora', date: '03 / 11 / 2014', time: '4:53 am', status: 'running', level: 1},
        {id: 'master11', changeList: 675454, owner: 'Kelli', date: '03 / 11 / 2014', time: '4:53 am', status: 'running', level: 2},
    ]
};

app.get('/getReportData/:reportId', function(req, res) {
    var data = dataSource[req.params.reportId];
    res.json(data);
});


app.get('/getDetailData/:reportId/:recordId', function(req, res) {
    var reportId = req.params.reportId,
        recordId = req.params.recordId,
        recordList = dataSource[reportId],
        master, detailData, message;

    master = _.find(recordList, function (rec) {
        return rec.id == recordId; 
    });

    switch (master.status) {
        case "passed":
            detailData = {
                statusMsg: 'Passed',
                build: {
                    completed: true,
                    time: '3:13am'
                },
                unitTest: {
                    completed: true,
                    name: 'Unit Test',
                    time: '3:13am',
                    perc: 88,
                    topInfo: 342,
                    bottomInfo: 3
                },
                functionalTest: {
                    name: 'Functional Test',
                    completed: true,
                    time: '3:13am',
                    perc: 98,
                    topInfo: 34342,
                    bottomInfo: 3000
                }
            };
            break;

        case "failed":
        case "pending":
        case "running":
            var perc = 88;
            switch (master.status) {
                case "pending":
                    perc = 65;
                    break;
                case "running":
                    perc = 71;
                    break;
            }
            switch (master.level) {
                case 1:
                    message = master.status === "failed" ? "Can't Run" : "Yet to go";
                    detailData = {
                        build: {
                            name: 'Build',
                            completed: false,
                            time: '3:13am'
                        },
                        unitTest: {
                            name: 'Unit Test',
                            completed: false,
                            perc: 0,
                            message: message
                        },
                        functionalTest: {
                            name: 'Functional Test',
                            completed: false,
                            perc: 0,
                            message: message
                        }
                    };
                    break;
                case 2:
                    message = master.status === "failed" ? "Can't Run" : "Yet to go";
                    detailData = {
                        build: {
                            name: 'Build',
                            completed: true,
                            time: '3:13am'
                        },
                        unitTest: {
                            name: 'Unit Test',
                            completed: false,
                            time: '3:13am',
                            perc: 0,
                            message: message
                        },
                        functionalTest: {
                            name: 'Functional Test',
                            completed: false,
                            perc: 0,
                            message: message
                        }
                    };
                    break;
                case 3:
                    if (master.status === "failed") {
                        message = "Can't Run";
                    } else {
                        if (master.status === "pending") {
                            message = "Ready to start";
                        } else {
                            message = "Going on";
                        }
                    }
                    detailData = {
                        build: {
                            name: 'Build',
                            completed: true,
                            time: '3:13am'
                        },
                        unitTest: {
                            completed: true,
                            name: 'Unit Test',
                            time: '5:42pm',
                            perc: perc,
                            topInfo: 342,
                            bottomInfo: 3
                        },
                        functionalTest: {
                            name: 'Functional Test',
                            completed: false,
                            perc: 0,
                            message: message
                        }
                    };
                    break;
            }
            break;
    }

    if (detailData) {
        var statusMsg = master.status === 'failed' ? 'Failure' : master.status;
        statusMsg = statusMsg.substring(0, 1).toUpperCase() + statusMsg.substring(1);
        _.extend(detailData, {
            status: master.status,
            statusMsg: statusMsg,
            level: master.level,
            detail: true
        });
    }
    
    console.log(detailData)
    res.json(detailData);

});

//Patch for backward compatibility
app.address = function() {
    return { port : port};
};

app.get('/getCsv', function (req, res) {
    res.set('Content-Type', 'application/octet-stream');
	res.send("1,2,3\n\r4,5,6");
});

var ip = "localhost";
app.listen(port, ip, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});



