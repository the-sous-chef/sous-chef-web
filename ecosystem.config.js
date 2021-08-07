const apps = [
    {
        autorestart: true,
        exec_mode: 'cluster',
        error: '/var/log/souschef.error.err',
        instances: -1,
        kill_timeout: 2000,
        max_memory_restart: '3G',
        merge_logs: true,
        name: 'sous-chef',
        output: '/var/log/souschef.out.log',
        script: './dist/server.js',
        watch: false,
    },
];

module.exports = {
    apps,
};
