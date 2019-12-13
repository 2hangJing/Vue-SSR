let hotCallbacl = require("webpack-hot-middleware/client.js");

hotCallbacl.subscribe((obj)=>{
    if (obj.action === 'reload') {

        window.location.reload()
    }
})