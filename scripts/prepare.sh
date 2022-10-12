#!/bin/sh

GREEN='\033[0;32m'
RED='\033[0;31m'

npx husky install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Husky successfully installed!"

    if [ ! -f "$(pwd)/.husky/commit-msg" ]; then
        npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Husky commitlint successfully created!"
        else
            echo -e "${RED}There was an issue creating the Husky commitlint pre-commit hook."
        fi
    fi
else
    echo -e "${RED}There was an error installing Husky. Try installing it after the package is created."
fi
