#!/bin/sh

install () {
    /bin/sh install-esbuild.sh
}

run () {
    if [[ "$1" == "client" ]]; then
        npm run dev:client
    else
        npm run dev:server
    fi
}

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -t|--target) run "$2"; shift ;;
        -i|--install) install ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done
