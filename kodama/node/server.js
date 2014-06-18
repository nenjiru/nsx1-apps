/*
--------------------------------------------------------------------------------
    Config
--------------------------------------------------------------------------------
*/
var os      = require('os'),
    fs      = require('fs'),
    exec    = require('child_process').exec,
    restify = require('restify');

var PORT = 3939;

/*
--------------------------------------------------------------------------------
    Server
--------------------------------------------------------------------------------
*/
var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get(/\/.*/, restify.serveStatic({
    directory: __dirname + '/../',
    default: 'index.html'
}));

server.post('/kakasi', function (req, res, next)
{
    var text = req.params.text,
        command = 'echo '+ text +' | nkf -e | kakasi -JH -KH  | nkf -w';

    if (text)
    {
        exec(command, {timeout: 1000}, function(error, stdout, stderr)
        {
            if (!error && !stderr)
            {
                res.send(stdout);
            }
            else
            {
                console.log('stderr: '+(stderr||'none'));
                console.log('exec error: '+error);
            }
        });
    }
    else
    {
        res.send(500);
    }

    next();
});

server.listen(PORT, function()
{
    exec('open http://localhost:'+ PORT);
});
