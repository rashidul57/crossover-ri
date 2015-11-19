Make sure your sass command available, otherwise take help from this link
http://sass-lang.com/install

Change directory to css\
>cd ....css

For development and watch continuously:
>sass --watch sass/app.scss:app.css --style compressed

For compressed css in production:
>sass sass/app.scss:app.css --style compressed