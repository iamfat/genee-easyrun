// TODO 未处理 beanstalkd 未启动时的错误 (Xiaopei Li@2013-11-13)

var bs = require('nodestalker')
	, client = bs.Client();


// usage       push [-t tube] [-u user] task
// default     push -t default task
// generate    sudo -u nobody task

module.exports = function(argv) {
	client
		.use(argv.t||'easyrun')
		.onSuccess(function (data) {
			var cmd = argv._.join(' ');
			client
				.put(JSON.stringify({
					user: argv.u || '',
					command: cmd
				}))
				.onSuccess(function (data) {
					client.disconnect();
				});
		});
}
