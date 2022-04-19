import gunicorn #dummy

from flask import Flask
app = Flask( __name__, static_folder='public', static_url_path='' )

@app.route( '/' )
def static_file(path):
    return app.send_static_file( 'index.html' )