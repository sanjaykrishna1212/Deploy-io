const prompts = require( 'prompts' );
const express = require( 'express' );
const path = require( 'path' );
const app = express();

( async () =>
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
                    if ( value < 1 || value > 9999 )
                    {
                        return 'Please enter a port number between 1 and 9999.';
                    }
                    return true;
                },
            },
        ] );

        const distPath = folderPath;
        const serverport = port;

        // Serve static files from the dist folder
        app.use( express.static( distPath ) );

        // Serve index.html for all unmatched routes
        app.get( '*', ( req, res ) =>
        {
            res.sendFile( path.join( distPath, 'index.html' ) );
        } );

        app.listen( serverport, () =>
        {
            console.log( `Server listening on port ${serverport}` );
        } );
    } catch ( error )
    {
        console.error( error );
    }
} )();

