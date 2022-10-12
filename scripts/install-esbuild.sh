counter=1
while [[ $counter -le 3 ]] ; do
    node node_modules/esbuild/install.js && break
    counter=$(( counter + 1 ))
done
