#!/bin/bash

echo "=== 首先会添加若干任务"

echo "./bin/easyrun-push  'sleep 10 && echo hello-1'"
./bin/easyrun-push  'sleep 10 && echo hello-1'
echo "./bin/easyrun-push  'sleep 10 && echo hello-2'"
./bin/easyrun-push  'sleep 10 && echo hello-2'
echo "./bin/easyrun-push  'sleep 3 && echo hello-3'"
./bin/easyrun-push  'sleep 3 && echo hello-3'
echo "./bin/easyrun-push  'echo hello-4'"
./bin/easyrun-push  'echo hello-4'
echo "./bin/easyrun-push  'echo hello-5'"
./bin/easyrun-push  'echo hello-5'


echo "=== 接下来会开 2 个 worker 运行以上任务,
运行结果应该是等待 1, 2 运行完,
才运行 3, 4, 5"

./bin/easyrun -n 2

# 非 sudo 不应能发送 sudo 命令
