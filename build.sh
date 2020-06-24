for file in node_modules/materialize-css/js/*.js; do
    modname="$(echo $file | sed 's@node_modules/materialize-css/js/@@g;s/\.js//g')"
    echo ${modname^}: \"exports-loader?${modname^}\!$(echo $file | sed 's/node_modules\///g;s/\.js//g')\",
done
