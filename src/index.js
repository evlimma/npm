function importAllFromContext(context) {
    context.keys().forEach(context);
}

// JS
// import 'tablesorter';

const jsContexts = [
    //require.context('../shared/scripts/evlimma', true, /\.js$/),
    require.context('./js', true, /\.js$/)
];

jsContexts.forEach(importAllFromContext);

// CSS
// import 'bootstrap/dist/css/bootstrap.min.css';

// const cssContexts = [
//     require.context('../shared/styles', true, /\.css$/),
//     require.context('./css', true, /\.css$/)
// ];

// cssContexts.forEach(importAllFromContext);
