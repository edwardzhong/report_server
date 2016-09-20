export PATH=$PATH:/usr/local/node/bin/:/usr/local/node/usr/local/lib/node_modules/forever/bin/
echo 'stop rep_sys:'
forever stop bin/start.js
echo 'start rep_sys:'
forever start bin/start.js