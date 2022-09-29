export function MarkRoute(route, client, server) {
    return function (target, name, descriptor) {
        console.log("MarkRouteDecorator(): called", target, name, descriptor);
    };
}
//# sourceMappingURL=MarkRoutes.js.map