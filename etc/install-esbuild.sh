# if [ -d "node_modules/esbuild-windows-64" ]; then
#     rm -rf node_modules/esbuild-windows-64
# elif [ -d "node_modules/esbuild-darwin-arm64" ]; then
#     rm -rf node_modules/esbuild-darwin-arm64
# else
#     echo "new platform detected, don't know what to remove from esbuild"
# fi

counter=1
while [[ $counter -le 3 ]] ; do
    node node_modules/esbuild/install.js && break
    ((counter++))
done