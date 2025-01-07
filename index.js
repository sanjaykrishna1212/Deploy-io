const prompts = require( 'prompts' );
const express = require( 'express' );
const path = require( 'path' );
const os = require( 'os' );
const app = express();

function getLocalIP()
{
    const interfaces = os.networkInterfaces();   
    for ( const name in interfaces )
    {
        for ( const iface of interfaces[ name ] )
        {
            if ( iface.family === 'IPv4' && !iface.internal )
            {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

async function hosting()
{
    try
    {
        const { folderPath, port } = await prompts( [
            {
                type: 'text',
                name: 'folderPath',
                message: 'Enter the path to your Angular project\'s dist folder:',
                validate: ( value ) =>
                {
                    if ( !path.isAbsolute( value ) )
                    {
                        return 'Please enter an absolute path.';
                    }
                    return true;
                },
            },
            {
                type: 'number',
                name: 'port',
                message: 'Enter the port number (between 1 and 9999):',
                validate: ( value ) =>
                {
                    if ( value <= 1 || value > 9999 )
                    {
                        return 'Please enter a port number between 1 and 9999.';
                    }
                    return true;
                },
            },
        ] );

        const distPath = folderPath;
        const serverport = port;
        const ipAddress = getLocalIP();

        app.use( express.static( distPath ) );
        app.get( '*', ( req, res ) =>
        {
            res.sendFile( path.join( distPath, 'index.html' ) );
        } );

        app.listen( serverport, () =>
        {
            console.log( `Server is running at: http://${ipAddress}:${serverport}` );
        } );
    }
    catch ( error )
    {
        console.error( error );
    }
}

hosting();
