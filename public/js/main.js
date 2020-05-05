window.onload = () => {
    // 通話中オペレーター件数取得
    $.ajax({
        type: 'GET',
        url: '/statistics/calls/currents',
        success: (json) => {   // 200 OK時
            // JSON Arrayの先頭が成功フラグ、失敗の場合2番目がエラーメッセージ
            if (json.code !== 200) {    // サーバが失敗を返した場合
                console.error("Transaction error. " + json.message);
                $('#current-calling').text('取得失敗');
                return;
            }
            $('#current-calling').text(json.counts);
        },
        error: () => {
            console.error("Server Error. Pleasy try again later.");
            $('#current-calling').text('取得失敗');
        }
    });

    // 当日通話数取得
    $.ajax({
        type: 'GET',
        url: '/statistics/calls/references',
        data: {
            date: new Date().toISOString()
        },
        success: (json) => {   // 200 OK時
            // JSON Arrayの先頭が成功フラグ、失敗の場合2番目がエラーメッセージ
            if (json.code !== 200) {    // サーバが失敗を返した場合
                console.error("Transaction error. " + json.message);
                $('#current-calling').text('取得失敗');
                return;
            }
            $('#todays-calling').text(json.counts);
        },
        error: () => {
            console.error("Server Error. Pleasy try again later.");
            $('#current-calling').text('取得失敗');
        }
    });
};


var mainChart = new Chart($('#main-chart'), {
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: hexToRgba(getStyle('--info'), 10),
            borderColor: getStyle('--info'),
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: [165, 180, 70, 69, 77, 57, 125, 165, 172, 91, 173, 138, 155, 89, 50, 161, 65, 163, 160, 103, 114, 185, 125, 196, 183, 64, 137, 95, 112, 175, 123, 11, 45]
        }]
    },
    options: {
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    max: 250
                }
            }]
        },
        elements: {
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3
            }
        }
    }
});
// var brandBoxChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
// var brandBoxChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     legend: {
//         display: false
//     },
//     scales: {
//         xAxes: [{
//             display: false
//         }],
//         yAxes: [{
//             display: false
//         }]
//     },
//     elements: {
//         point: {
//             radius: 0,
//             hitRadius: 10,
//             hoverRadius: 4,
//             hoverBorderWidth: 3
//         }
//     } // eslint-disable-next-line no-unused-vars
//
// };
// var brandBoxChart1 = new Chart($('#social-box-chart-1'), {
//     type: 'line',
//     data: {
//         labels: brandBoxChartLabels,
//         datasets: [{
//             label: 'My First dataset',
//             backgroundColor: 'rgba(255,255,255,.1)',
//             borderColor: 'rgba(255,255,255,.55)',
//             pointHoverBackgroundColor: '#fff',
//             borderWidth: 2,
//             data: [65, 59, 84, 84, 51, 55, 40]
//         }]
//     },
//     options: brandBoxChartOptions
// }); // eslint-disable-next-line no-unused-vars
//
// var brandBoxChart2 = new Chart($('#social-box-chart-2'), {
//     type: 'line',
//     data: {
//         labels: brandBoxChartLabels,
//         datasets: [{
//             label: 'My First dataset',
//             backgroundColor: 'rgba(255,255,255,.1)',
//             borderColor: 'rgba(255,255,255,.55)',
//             pointHoverBackgroundColor: '#fff',
//             borderWidth: 2,
//             data: [1, 13, 9, 17, 34, 41, 38]
//         }]
//     },
//     options: brandBoxChartOptions
// }); // eslint-disable-next-line no-unused-vars
//
// var brandBoxChart3 = new Chart($('#social-box-chart-3'), {
//     type: 'line',
//     data: {
//         labels: brandBoxChartLabels,
//         datasets: [{
//             label: 'My First dataset',
//             backgroundColor: 'rgba(255,255,255,.1)',
//             borderColor: 'rgba(255,255,255,.55)',
//             pointHoverBackgroundColor: '#fff',
//             borderWidth: 2,
//             data: [78, 81, 80, 45, 34, 12, 40]
//         }]
//     },
//     options: brandBoxChartOptions
// }); // eslint-disable-next-line no-unused-vars
//
// var brandBoxChart4 = new Chart($('#social-box-chart-4'), {
//     type: 'line',
//     data: {
//         labels: brandBoxChartLabels,
//         datasets: [{
//             label: 'My First dataset',
//             backgroundColor: 'rgba(255,255,255,.1)',
//             borderColor: 'rgba(255,255,255,.55)',
//             pointHoverBackgroundColor: '#fff',
//             borderWidth: 2,
//             data: [35, 23, 56, 22, 97, 23, 64]
//         }]
//     },
//     options: brandBoxChartOptions
// });
// //# sourceMappingURL=main.js.map