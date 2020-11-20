
const listRegisteredRoutes = (router) => {
    var routes = [];
    router.stack.forEach(element => {
        if (element.route && element.route.path) {
            routes.push(Object.keys(element.route.methods)[0] + ": " + element.route.path);
        }
    });
    return routes;
}

module.exports = {
    listRegisteredRoutes
}
