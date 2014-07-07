// TODO 未处理 beanstalkd 未启动时的错误 (Xiaopei Li@2013-11-13)

var cluster = require('cluster')
    , bs = require('nodestalker')
    , client = bs.Client();


// usage      run [-n n] [tube]
// default    run -n 1 default

module.exports = function(argv) {
	if (cluster.isMaster) {
		var num = argv.n || 1;
		while (num--) {
			cluster.fork();
		}
	}
	else {
		console.log('Worker ' + process.pid + ' started...');

	    var tube = argv._[0]||'easyrun';

		client
			.watch(tube)
			.onSuccess(function(data) {


				function _job() {
					client.reserve()
						.onSuccess(function(job) {
							console.log(job);
							var data = JSON.parse(job.data);
							var child_process = require('child_process');
							var user = data.user || 'nobody';
							var	command = 'sudo -u ' + user + ' ' + data.command;
							console.log(process.pid +' run: '+ command);

							child_process.exec(command, function (err, stdout, stderr) {

								console.log(process.pid + ' done.');
								client.deleteJob(job.id).onSuccess(function() {

									// 任务成功运行并删除任务后, 再去取下一个任务
									_job();
								});
							});
						});
				}

                            // client 默认会 watch default tube, 所以 watch 后,
                            // 需手动 ignore default, 再执行业务
                            if (tube != 'default') {
                                client.ignore('default').onSuccess(function(idata) {

                                    _job();
                                });
                            } else {
                                _job();
                            }


			});
	}
}
