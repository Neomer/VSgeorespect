version=$1
out_dir=./release-$version

echo generate release v.$version

# generation of folder
echo check folder exists
if [ -d "$out_dir" ]; then
  echo folder already exists! drop it...
  rm -R $out_dir
fi
echo creating new release folder \'$out_dir\'
mkdir $out_dir
mkdir $out_dir/scripts
mkdir $out_dir/content
mkdir $out_dir/content/images
mkdir $out_dir/content/images/x16

#copy files
echo coping files
cp ../georespect/test.html $out_dir/index.html
cp ../georespect/map.min.js $out_dir/map.min.js
cp ../georespect/scripts/jquery-3.3.1.min.js $out_dir/scripts/jquery-3.3.1.min.js
cp ../georespect/scripts/jquery-ui-1.12.1.custom/external/jquery/jquery.js $out_dir/scripts/jquery-1.12.1.js
cp ../georespect/scripts/jquery-ui-1.12.1.custom/jquery-ui.min.js $out_dir/scripts/jquery-ui.min.js
cp ../georespect/scripts/spectrum.js $out_dir/scripts/spectrum.js
cp ../georespect/scripts/html2canvas.min.js $out_dir/scripts/html2canvas.min.js
cp ../georespect/scripts/jquery-ui-1.12.1.custom/jquery-ui.min.css $out_dir/content/jquery-ui.min.css
cp ../georespect/content/bootstrap.min.css $out_dir/content/bootstrap.min.css
cp ../georespect/content/Style.css $out_dir/content/Style.css
cp ../georespect/content/spectrum.css $out_dir/content/spectrum.css
cp ../georespect/content/images/x16/* $out_dir/content/images/x16
cp ../georespect/scripts/jquery-ui-1.12.1.custom/images/* $out_dir/content/images

#end
echo release is ready!
