const spawn = require('child_process').spawn;
const execFile = require('child_process').execFile;

const docker = {
    async run(image, commandArgs, options, execOptions) {
        const args = commandArgs
            ? [image].concat(commandArgs)
            : image;
        const execMode = options.detach ? 'exec' : 'spawn';
        
        const child = await this.exec('run',
            args,
            options,
            execMode,
            execOptions
        );
        return options.detach
            ? new Container(child.stdout.trim())
            : child;
    },

    async build(url, options, execOptions) {
        return await this.exec('build',
            url,
            options,
            'spawn',
            execOptions
        );
    },

    async start(id, options) {
        const ct = new Container(id);
        await ct.start(options);
        return ct;
    },

    async stop(id, options) {
        const ct = new Container(id);
        return await ct.stop(options);
    },

    async rm(id, options) {
        const ct = new Container(id);
        return await ct.rm(options);
    },

    async inspect(id, options) {
        const ct = new Container(id);
        return await ct.inspect(options);
    },

    async exec(command, args, options, execMode, execOptions) {
        const execArgs = [command];

        if (options)
            for (const option in options) {
                execArgs.push(`--${camelToSnake(option)}`);
                if (typeof options[option] !== 'boolean')
                    execArgs.push(options[option]);
            }

        if (Array.isArray(args))
            Array.prototype.push.apply(execArgs, args);
        else if (args)
            execArgs.push(args);

        return await new Promise((resolve, reject) => {
            if (execMode == 'spawn') {
                if (execOptions === true)
                    execOptions = {
                        stdio: [
                            process.stdin,
                            process.stdout,
                            process.stderr
                        ] 
                    };

                const child = spawn('docker', execArgs, execOptions || undefined);
                child.on('exit', code => {
                    if (code !== 0) {
                        const args = JSON.stringify(execArgs);
                        reject(new Error(`docker: ${args}: exit code ${code}`));
                    } else
                        resolve(code);
                });
            } else {
                execFile('docker', execArgs, (err, stdout, stderr) => {
                    if (err)
                        reject(err);
                    else
                        resolve({stdout, stderr});
                });
            }
        });
    }
};

class Container {
    constructor(id) {
        if (!id)
            throw new Error('Container id argument is required');
        this.id = id;
    }

    async start(options) {
        await docker.exec('start', this.id, options);
    }

    async stop(options) {
        await docker.exec('stop', this.id, options);
    }

    async rm(options) {
        await docker.exec('rm', this.id, options);
    }

    async inspect(options) {
        const child = await docker.exec('inspect', this.id, options);
        return JSON.parse(child.stdout);
    }
}

function camelToSnake(str) {
    return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}

module.exports = docker;
module.exports.Container = Container;
