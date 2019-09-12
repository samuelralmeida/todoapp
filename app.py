from flask import Flask
from flask_migrate import Migrate

from extensions import db
from controllers import main


def create_app(config_file='config.py'):
    app = Flask(__name__)
    app.config.from_pyfile(config_file)

    db.init_app(app)
    Migrate(app, db)

    app.register_blueprint(main)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run()
